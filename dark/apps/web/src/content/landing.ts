import type { IconName } from "../components/Icon";

/**
 * CAŁA treść landingu. Sekcję wyłączasz, ustawiając ją na null.
 * Zasada: bez wymyślonych liczb i opinii — tylko prawdziwe fakty o produkcie (PRODUCT.md).
 */
export type Landing = {
  meta: { title: string; description: string };
  hero: {
    title: string;
    /** Fragment tytułu podkreślony "atramentem". Musi występować w title. */
    highlight: string;
    lead: string;
    primary: { label: string; href: string };
    secondary?: { label: string; href: string };
    /** Przykładowe notatki na "kartce" obok nagłówka (ilustracja, nie dane). */
    sample: { title: string; body: string }[];
  };
  features: { title: string; items: { icon: IconName; title: string; body: string }[] } | null;
  steps: { title: string; items: { title: string; body: string }[] } | null;
  faq: { title: string; items: { q: string; a: string }[] } | null;
  cta: { title: string; body: string; action: { label: string; href: string } } | null;
};

export const landing: Landing = {
  meta: {
    title: "Notatnik — notatki, które są zawsze pod ręką",
    description: "Zapisuj myśli w przeglądarce, na Androidzie i iOS. Jedno konto, te same notatki wszędzie.",
  },
  hero: {
    title: "Notatki, które są zawsze pod ręką",
    highlight: "pod ręką",
    lead: "Zapisz myśl na telefonie, popraw ją przy biurku. Jedno konto, te same notatki w przeglądarce, na Androidzie i iOS.",
    primary: { label: "Załóż konto", href: "/register" },
    secondary: { label: "Mam już konto", href: "/login" },
    sample: [
      { title: "Zakupy na sobotę", body: "chleb, pomidory, kawa ziarnista" },
      { title: "Pomysł na wstęp", body: "Zacząć od pytania, nie od definicji." },
    ],
  },
  features: {
    title: "Mało funkcji, każda dopracowana",
    items: [
      {
        icon: "devices",
        title: "Jedna aplikacja, trzy ekrany",
        body: "Ten sam kod działa w przeglądarce, na Androidzie i na iOS. Nie ma wersji gorszej.",
      },
      {
        icon: "lock",
        title: "Twoje notatki są tylko twoje",
        body: "Każda notatka należy do konta. Nikt inny jej nie zobaczy ani nie zmieni.",
      },
      {
        icon: "pen",
        title: "Pisanie bez ceremonii",
        body: "Tytuł, treść, zapisz. Edycja w miejscu, bez przechodzenia między ekranami.",
      },
    ],
  },
  steps: {
    title: "Jak zacząć",
    items: [
      { title: "Załóż konto", body: "Wystarczy email i hasło." },
      { title: "Dodaj notatkę", body: "Tytuł jest wymagany, treść — jak chcesz." },
      { title: "Otwórz gdziekolwiek", body: "Zaloguj się na innym urządzeniu i pisz dalej." },
    ],
  },
  faq: {
    title: "Pytania",
    items: [
      { q: "Czy to kosztuje?", a: "To aplikacja demonstracyjna szablonu. Konto jest bezpłatne." },
      {
        q: "Gdzie są przechowywane notatki?",
        a: "W bazie PostgreSQL na serwerze aplikacji, z nocną kopią zapasową.",
      },
      { q: "Czy mogę usunąć notatkę?", a: "Tak. Usunięcie jest natychmiastowe i nieodwracalne." },
    ],
  },
  cta: {
    title: "Pierwsza notatka zajmie minutę",
    body: "Załóż konto i zapisz to, o czym właśnie myślisz.",
    action: { label: "Załóż konto", href: "/register" },
  },
};
