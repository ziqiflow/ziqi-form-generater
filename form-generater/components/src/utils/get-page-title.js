import defaultSettings from '@/settings'

const title = defaultSettings.title || '之奇OA'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
