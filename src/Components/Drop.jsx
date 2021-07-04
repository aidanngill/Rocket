import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDropzone } from "react-dropzone";
import { Table, ProgressBar } from "react-bootstrap"

import Config from "../Config";
import Instance from "../Session";

const File = ({ file }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");

  const user = useSelector(store => store.user);

  useEffect(() => {
    var formData = new FormData();
    formData.append("file", file);

    if (Object.keys(user).length > 0)
      formData.append("apikey", user.apikey);

    Instance.request({
      method: "PUT",
      url: "/file",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data"
      },
      onUploadProgress: (p) => {
        setProgress((p.loaded / p.total) * 100);
      }
    })
    .then(resp => resp.data)
    .then(data => {
      setStatus((
        <a href={Config.returnUrl + "/" + data.name} target="_blank" rel="noreferrer">
          {data.name}
        </a>
      ));

      setProgress(100);
    })
    .catch(function(error) {
      if (error.response) {
        if (error.response.status === 404) {
          setStatus("API is unavailable.");
        } else {
          setStatus(error.response.data.error);
        }
      } else if (error.request) {
        setStatus("Unexpected error occured...");
      } else {
        setStatus("Unknown error occured: " + error.message);
      }
    });
  }, [
    file,
    user
  ]);

  return (
    <tr key={file.name}>
      <td>
        {(file.size / 1024 / 1024).toFixed(1)} MB
      </td>
      <td>
        {file.path}
      </td>
      <td>
        <ProgressBar
          variant={progress === 100 ? "success" : ""}
          now={progress}
        />
      </td>
      <td>
        {status}
      </td>
    </tr>
  );
}

const Drop = () => {
  const {
    acceptedFiles,
    getRootProps,
    getInputProps
  } = useDropzone({
    maxFiles: 10
  });

  return (
    <section className="container">
      <div {...getRootProps({className: "dropzone"})}>
        <input {...getInputProps()} />
        <p>Drag some files here, or click to select files.</p>
      </div>
      <aside>
        <h4>Files</h4>
        <Table responsive>
          <thead>
            <tr>
              <th>Size</th>
              <th>File</th>
              <th>Progress</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody>
            {acceptedFiles.map(file => (
              <File file={file} />
            ))}
          </tbody>
        </Table>
      </aside>
    </section>
  );
}

export default Drop;