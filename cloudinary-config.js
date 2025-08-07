function uploadToCloudinary(file) {
  return new Promise(function (resolve, reject) {
    const url = 'https://api.cloudinary.com/v1_1/dsf1mbhkh/upload';
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'flashback_app');
    fetch(url, {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        if (data.secure_url) {
          resolve(data.secure_url);
        } else {
          reject(
            new Error(
              data.error && data.error.message
                ? data.error.message
                : 'Upload failed'
            )
          );
        }
      })
      .catch(reject);
  });
}

window.uploadToCloudinary = uploadToCloudinary;
