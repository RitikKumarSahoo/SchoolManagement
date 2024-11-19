const { Client } = require('linkedin-private-api');

/**
 * Searches for user profiles on LinkedIn using the linkedin-private-api package.
 * 
 * @param {string} query - The search query (e.g., name, title, or company).
 * @returns {Promise<Array>} - A list of search results with user profile details.
 */
async function searchUserProfiles(query) {
    const client = new Client();

    // Login using your LinkedIn credentials
    await client.login.userPass({
        username: process.env.LINKEDIN_EMAIL, // Set in .env file
        password: process.env.LINKEDIN_PASSWORD, // Set in .env file
    });

    try {
        // Perform a search for people based on the query
        const results = await client.search.searchPeople({
            keywords: query,
        });

        // Map the results to get profile details
        return results.map(person => ({
            firstName: person.firstName,
            lastName: person.lastName,
            headline: person.headline,
            location: person.locationName,
            profileUrl: `https://www.linkedin.com/in/${person.publicIdentifier}/`,
        }));
    } catch (error) {
        console.error('Error searching for user profiles:', error);
        throw error;
    }
}

// Example usage
(async () => {
    try {
        const results = await searchUserProfiles('kiran');
        console.log('User Profiles:', results);
    } catch (error) {
        console.error('Error:', error);
    }
})();
