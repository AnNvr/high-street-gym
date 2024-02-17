import { useRef, useState } from "react";
import { API_URL } from "../api/api.js";
import { useAuthentication } from "../hooks/authentication.jsx";

export function XMLUpload({ onUploadSuccess }) {
    const [user] = useAuthentication();
    const [status, setStatus] = useState("");

    // useRef is the react way of getting an element reference like below:
    // const uploadInput = document.getElementById("file-input")
    const uploadInputRef = useRef(null);

    function uploadFile(e) {
        e.preventDefault();

        // Files is an array because the user could select multiple files
        // we choose to upload only the first selected file in this case.
        const file = uploadInputRef.current.files[0];

        // Fetch expects multi-part form data to be provided
        // inside a FormData object.
        const formData = new FormData();
        formData.append("xml-file", file);

        fetch(
            API_URL +
                "/activities/upload/xml?authKey=" +
                user.authentication_key,
            {
                method: "POST",
                body: formData,
            }
        )
            .then((res) => res.json())
            .then((APIResponse) => {
                setStatus(APIResponse.message);
                // clear the selected file
                uploadInputRef.current.value = null;
                // Notify of successful upload
                if (typeof onUploadSuccess === "function") {
                    onUploadSuccess();
                }
            })
            .catch((error) => {
                setStatus("Upload failed " + error);
            });
    }

    return (
        <div class="flex justify-center items-center h-screen">
            <form
                class="w-full max-w-lg p-5 bg-white rounded-lg shadow-xl"
                onSubmit={uploadFile}
            >
                <div class="form-control w-full mb-4">
                    <label class="label">
                        <span class="label-text text-lg font-semibold">
                            XML File Import
                        </span>
                    </label>
                    <div class="flex items-center gap-2">
                        <input
                            ref={uploadInputRef}
                            type="file"
                            class="file-input w-full text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-full file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-primary file:text-white
                                    hover:file:bg-primary-dark"
                        />
                        <button class="btn btn-primary">Upload</button>
                    </div>
                    <label class="label pt-2">
                        <span class="label-text-alt text-sm">{status}</span>
                    </label>
                </div>
            </form>
        </div>
    );
}
