import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
const resources = {
  en: {
    translation: {
      common: {
        loading: 'Loading...',
        back: 'Back',
        next: 'Next',
        submit: 'Submit',
        pleaseWait: 'Please wait...',
      },
      intro: {
        startQuiz: 'Start Quiz',
      },
      questions: {
        errorSelect: 'Please select an answer to continue',
        instruction: 'Answer the question below',
      },
      submission: {
        title: "That's all the questions!",
        description:
          "Please provide your details to access your personal result. We'll also email you a link.",
        form: {
          name: 'Name',
          namePlaceholder: 'Enter your name',
          email: 'Email',
          emailPlaceholder: 'Enter your email',
          phone: 'Phone',
          zip: 'Zip Code',
          address: 'Address',
          fieldPlaceholder: 'Enter your {{label}}',
          required: '{{label}} is required',
          invalidEmail: 'Invalid email address',
        },
        success: 'Successfully submitted!',
        error: 'Failed to submit quiz',
      },
      result: {
        calculating: 'Calculating your results...',
        errorTitle: 'Oops! Something went wrong.',
        errorDescription:
          "We couldn't retrieve your results. Please try again later.",
        copySuccess: 'Link copied to clipboard!',
        copyError: 'Failed to copy link',
        downloading: 'Downloading...',
        pdfFail:
          'Failed to generate PDF. Please check the console for details.',
        advisorMeeting: 'Feel free to setup a meeting with an advisor.',
      },
      notFound: {
        title: 'Page Not Found',
        description:
          'Oops! The page you are looking for does not exist. It might have been moved or deleted.',
      },
    },
  },
  se: {
    translation: {
      common: {
        loading: 'Laddar...',
        back: 'Tillbaka',
        next: 'Nästa',
        submit: 'Skicka',
        pleaseWait: 'Vänligen vänta...',
      },
      intro: { startQuiz: 'Starta quiz' },
      questions: {
        errorSelect: 'Välj ett svar för att fortsätta',
        instruction: 'Svara på frågan nedan',
      },
      submission: {
        title: 'Det var alla frågor!',
        description:
          'Fyll i dina uppgifter för att få ditt personliga resultat. Vi skickar även en länk via e-post.',
        form: {
          name: 'Namn',
          namePlaceholder: 'Ange ditt namn',
          email: 'E-post',
          emailPlaceholder: 'Ange din e-postadress',
          phone: 'Telefon',
          zip: 'Postnummer',
          address: 'Adress',
          fieldPlaceholder: 'Ange din {{label}}',
          required: '{{label}} är obligatoriskt',
          invalidEmail: 'Ogiltig e-postadress',
        },
        success: 'Formuläret skickades!',
        error: 'Det gick inte att skicka quizet',
      },
      result: {
        calculating: 'Beräknar ditt resultat...',
        errorTitle: 'Hoppsan! Något gick fel.',
        errorDescription:
          'Vi kunde inte hämta ditt resultat. Försök igen senare.',
        copySuccess: 'Länken har kopierats!',
        copyError: 'Det gick inte att kopiera länken',
        downloading: 'Laddar ner...',
        pdfFail:
          'Det gick inte att skapa PDF-filen. Kontrollera konsolen för mer information.',
        advisorMeeting: 'Du är välkommen att boka ett möte med en rådgivare.',
      },
      notFound: {
        title: 'Sidan hittades inte',
        description:
          'Sidan du letar efter finns inte. Den kan ha flyttats eller tagits bort.',
      },
    },
  },
}

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    fallbackLng: 'en',
    lng: 'se',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  })

export default i18n
