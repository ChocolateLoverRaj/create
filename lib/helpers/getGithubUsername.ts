/**
 * Get a github username from a git url.
 * Example:
 * ```js
 * getGithubUsername('https://github.com/ChocolateLoverRaj/create')
 * ```
 * returns `ChocolateLoverRaj`
 */
const getGithubUsername = (url: string): string => url.split('/')[3]

export default getGithubUsername
