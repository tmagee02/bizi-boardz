import { Octokit } from "@octokit/core";

/**
 * @param {*} sha is provided during a file UPDATE. sha = null means CREATE file
 * @returns sha of created or updated file
 */
const createOrUpdateFile = async (pat, userName, repoName, path, content, message, sha = null) => {
    const octokit = new Octokit({ auth: pat });

    try {
        console.log(`${sha ? "UPDATING" : "CREATING"} ${path} with vals`, pat, userName, repoName, path, sha);
        let fileData = {
            owner: userName,
            repo: repoName,
            path: path,
            content: content,
            message: message
        }
        if (sha) {
            fileData['sha'] = sha;
        }
        // Send create or update request to github
        const response = await octokit.request(
            `PUT /repos/${userName}/${repoName}/contents/${path}`,
            fileData
        );
        console.log(message, "with old sha", sha);
        console.log("Response with new file content", response);
        return response.data.content.sha; // Return file sha
    } catch (error) {
        console.log("Creating file error from createFile function:", error);
        throw(error); // Indicate failed creation
    }
}



export default createOrUpdateFile;