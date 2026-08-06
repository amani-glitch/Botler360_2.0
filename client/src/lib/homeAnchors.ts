/**
 * The homepage's sticky-header anchors (brief §6bis section 1) need to work
 * both from the hub itself (smooth-scroll in place) and from any other page
 * (navigate to "/" then land on the right section once it's painted — see
 * the hash-scroll effect in Home.tsx and PrivacyPolicy.tsx).
 */
export function scrollToHomeSection(
  id: string,
  setLocation: (path: string) => void,
  currentPath: string,
) {
  if (currentPath === "/") {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  } else {
    setLocation(`/#${id}`);
  }
}
