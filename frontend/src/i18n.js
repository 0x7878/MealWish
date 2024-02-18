import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      "Added meal to the list": "Added \"{{mealName}}\" to the list",
      "is already in plan": "\"{{mealName}}\" is already in the current plan",
    }
  },
  de: {
    translation: {
      "No meals found for this week": "Für diese Woche wurden keine Esenswünsche gefunden",
      "Remove from day": "Aus dem plan entfernen",
      "Edit": "Bearbeiten",
      "Manage Meals": "Gerichte verwalten",
      "CW": "KW",
      "Manage Categories": "Kategorien verwalten",
      "Add Meal": "Gericht hinzufügen",
      "Edit Meal": "Gericht bearbeiten",
      "Just enter the name of the meal and upload a picture of": "Gib einfach den Namen des Gerichtes ein und lade ein Bild hoch",
      "it. Please also choose a category for the meal.": "Bitte wähle auch eine Kategorie für das Gericht aus.",
      "This field is required": "Dieses Feld muss ausgefüllt werden",
      "Category": "Kategorie",
      "Description": "Beschreibung",
      "Image": "Bild",
      "Delete": "Löschen",
      "Save": "Speichern",
      "This action will permanently delete the meal. Are you sure you want to proceed?": "Diese Aktion löscht den Eintrag unwiederbringlich. Bist du sicher, dass du fortfahren möchtest?",
      "Cancel": "Abbrechen",
      "Here you see a list of all categories. You can add new \ncategories or delete existing ones. If you want to edit a \ncategory, just click on the item.": "Hier siehst du eine Liste aller Kategorien. Du kannst neue Kategorien hinzufügen oder bestehende löschen. Wenn du eine Kategorie bearbeiten möchtest, klicke einfach auf den Eintrag.",
      "Add new category": "Neue Kategorie hinzufügen",
      "This action will try to delete the Category if no meals are linked.\nAre you sure you want to proceed?": "Es wird versucht die Kategorie zu löschen, sofer keine Gerichte verknüpft sind. Möchtest du fortfahren?",
      "Are you sure?": "Bist du sicher?",
      "Added to the list": "Zur Liste hinzugefügt",
      "Added meal to the list": "\"{{mealName}}\" wurde zur Wunschliste hinzugefügt",
      "is already in plan": "\"{{mealName}}\" ist bereits im aktuellen Plan", 
      "Removed from the wish list": "Von der Wunschliste entfernt",
      "Already in the wish list": "Bereits in der Wunschliste",
      "removed" : "wurde entfernt",
      "undo" : "rückgängig",
      "Wishes": "Wünsche",
    }
  }
};

i18n
  .use(initReactI18next) 
  .init({
    resources,
    lng: "en", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option

    interpolation: {
      escapeValue: false 
    }
  });

  export default i18n;