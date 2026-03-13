import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { WeeklyPlanResponse, UserInput, GroundingSource } from "../types";

export const generateWeeklyPlan = async (input: UserInput): Promise<WeeklyPlanResponse> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("Clé API manquante.");

  const ai = new GoogleGenAI({ apiKey });

  // Tentative de récupération des coordonnées GPS pour aider le grounding Google Maps
  let latLng: { latitude: number; longitude: number } | undefined = undefined;
  try {
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 3000 });
    });
    latLng = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    };
  } catch (e) {
    console.debug("Location access denied or unavailable, using address only.");
  }

  const basePrompt = `
    Rôle : Chef personnel expert en nutrition et logistique locale.

    CONTEXTE UTILISATEUR:
    - Lieu : "${input.address}"
    - Enseigne souhaitée : "${input.supermarket}"
    - Nombre de personnes : ${input.peopleCount}
    - Budget : ${input.budget || 'Non spécifié'}
    - Régime : ${input.diet || 'Omnivore'}
    - Allergies/Exclusions : ${input.unwantedIngredients || 'Aucune'}

    INSTRUCTIONS:
    1. Crée un menu de 7 jours (21 repas) sain, varié et adapté aux contraintes.
    2. Génère une liste de courses précise.
    3. TA RÉPONSE DOIT ÊTRE UN OBJET JSON VALIDE suivant strictement la structure ci-dessous.
    
    STRUCTURE JSON ATTENDUE:
    {
      "locationConfirmed": "Nom et adresse du magasin (ou estimation si non trouvé)",
      "supermarketContext": "Une phrase courte sur ce magasin ou le choix des produits",
      "weeklyPlan": [
        {
          "day": "Lundi",
          "breakfast": { "name": "...", "description": "...", "cookingTimeMinutes": 10, "recipe": { "ingredients": ["..."], "instructions": ["..."] } },
          "lunch": { "name": "...", "description": "...", "cookingTimeMinutes": 20, "recipe": { "ingredients": ["..."], "instructions": ["..."] } },
          "dinner": { "name": "...", "description": "...", "cookingTimeMinutes": 30, "recipe": { "ingredients": ["..."], "instructions": ["..."] } }
        }
      ],
      "shoppingList": [
        { "category": "...", "item": "...", "quantity": "...", "notes": "...", "estimatedPrice": 0.0 }
      ]
    }
  `;

  const safetySettings = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  ];

  const callGenAI = async (useTools: boolean) => {
    const prompt = useTools 
      ? `Utilise l'outil Google Maps pour localiser le magasin "${input.supermarket}" à proximité de "${input.address}" puis génère le plan. ` + basePrompt
      : `En supposant que le magasin "${input.supermarket}" est accessible à "${input.address}", génère le plan. ` + basePrompt;

    const config: any = {
      safetySettings,
    };

    if (useTools) {
      config.tools = [{ googleMaps: {} }];
      if (latLng) {
        config.toolConfig = { retrievalConfig: { latLng } };
      }
    }

    return await ai.models.generateContent({
      model: useTools ? "gemini-2.5-flash" : "gemini-3.1-pro-preview",
      contents: prompt,
      config
    });
  };

  try {
    let response;
    let text;
    
    // 1. Tentative avec Google Maps
    try {
        response = await callGenAI(true);
        text = response.text;
    } catch (e) {
        console.warn("Erreur lors de l'appel avec Maps:", e);
    }

    // 2. Fallback sans outils si la première tentative a échoué ou n'a pas produit de texte
    if (!text) {
        console.log("Tentative de repli (fallback) sans outil Maps...");
        response = await callGenAI(false);
        text = response.text;
    }

    if (!text) {
        // Log de la réponse complète pour le debug en cas d'échec total
        console.error("Échec total de génération. Réponse:", response);
        throw new Error("Impossible de générer le contenu après plusieurs tentatives. Veuillez vérifier votre connexion et réessayer.");
    }
    
    // Extraction des sources (seulement si disponibles dans la réponse finale)
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const sources: GroundingSource[] = [];
    
    if (groundingChunks) {
      groundingChunks.forEach((chunk: any) => {
        if (chunk.maps) {
          sources.push({ title: chunk.maps.title, uri: chunk.maps.uri });
        }
      });
    }
    
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/{[\s\S]*}/);
    const jsonString = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : text;
    
    try {
        const parsed = JSON.parse(jsonString.trim()) as WeeklyPlanResponse;
        return { ...parsed, sources };
    } catch (parseError) {
        console.error("Erreur de parsing JSON:", text);
        throw new Error("Le format de réponse de l'IA est invalide.");
    }
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};