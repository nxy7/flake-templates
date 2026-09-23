/** Jeden zestaw ikon: 24×24, obrys 1.5, zaokrąglone końce. Nową ikonę dopisz tutaj. */
const paths = {
  devices: (
    <>
      <rect x="2.75" y="4.75" width="13.5" height="10.5" rx="1.5" />
      <path d="M6.5 19.25h6" />
      <path d="M9.5 15.25v4" />
      <rect x="16.75" y="8.75" width="4.5" height="10.5" rx="1" />
    </>
  ),
  lock: (
    <>
      <rect x="4.75" y="10.75" width="14.5" height="9.5" rx="1.5" />
      <path d="M8.25 10.75V8a3.75 3.75 0 0 1 7.5 0v2.75" />
      <path d="M12 14.5v2" />
    </>
  ),
  pen: (
    <>
      <path d="M14.5 5.5l4 4L9 19H5v-4z" />
      <path d="M12.5 7.5l4 4" />
    </>
  ),
  plus: <path d="M12 5.5v13M5.5 12h13" />,
} as const;

export type IconName = keyof typeof paths;

export function Icon(props: { name: IconName; class?: string }) {
  return (
    <svg
      class={props.class ?? "icon"}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      {paths[props.name]}
    </svg>
  );
}
