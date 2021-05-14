/**
 * Gets a GitHub user url from a username.
 * Example:
 * ```js
 * getGithubUrl('ChocolateLoverRaj')
 * ```
 * Returns `https://github.com/ChocolateLoverRaj`
 */
const getGithubUserUrl = (username: string): string => `https://github.com/${username}`

export default getGithubUserUrl
