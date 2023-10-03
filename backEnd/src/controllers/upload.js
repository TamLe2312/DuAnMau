

const UploadService = {
    singleFile: async ({ file }) => {
        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await axios.post(
                `${baseURL}api/upload/single`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.data.filePath) {
                throw new Error("Failed to upload file");
            }

            const filepath = `${baseURL.slice(0, -1)}${response.data.filePath}`;
            console.log("upload success: ", filepath);
            return filepath;
        } catch (error) {
            console.error("Error uploading single file:", error);
            throw error;
        }
    },
}