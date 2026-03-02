export const buildMetadataXpath = (tag: string, text: string): string => {
  return `xpath=//${tag}[contains(normalize-space(.), "${text}")]/following-sibling::dd`;
};