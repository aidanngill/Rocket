import React, { useEffect, useState } from "react";
import { Redirect } from "react-router";
import { useSelector } from "react-redux";
import LoadingBar from "react-top-loading-bar";
import { useToasts } from "react-toast-notifications";
import { Button, Container, Modal, Table } from "react-bootstrap";

import strftime from "strftime";

import Config from "../../Config";
import Instance from "../../Session";

import PaginationBar from "../../Components/PaginationBar";

const getFileList = (user, page) => {
  return Instance.get(`/user/files/${page}`, {params: {
    apikey: user.apikey
  }})
  .then(resp => resp.data)
  .then(data => data.files);
}

const UserHome = () => {
  const [page, setPage] = useState(1);
  const [files, setFiles] = useState([]);
  const [fileCount, setFileCount] = useState(0);
  const [show, setShow] = useState(false);
  const [progress, setProgress] = useState(0);

  const [deleteTarget, setDeleteTarget] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const user = useSelector(store => store.user);

  const { addToast } = useToasts();

  const askDeleteFile = (file) => {
    setDeleteTarget(file);
    handleShow();
  }

  const doDeleteFile = () => {
    Instance.request({
      method: "DELETE",
      url: "/file",
      data: {
        apikey: user.apikey,
        file: deleteTarget.name
      }
    })
    .then(resp => resp.data)
    .then(data => {
      addToast(`Successfully deleted ${deleteTarget.name}.`, {
        appearance: "success"
      });

      getFileList(user, page).then(files => {
        setFiles(files);
      });
    });

    handleClose();
  }

  const copyApiKey = () => {
    navigator.clipboard.writeText(user.apikey);
    addToast("Copied your API key to the clipboard.", {
      appearance: "success"
    });
  }

  const onPageChanged = (currentPage) => {
    setPage(currentPage);
  }

  useEffect(() => {
    setProgress(50);

    Instance.get("/user/files", {
      params: {
        apikey: user.apikey
      }
    })
    .then(resp => resp.data)
    .then(data => {
      setFileCount(data.files);
    });

    getFileList(user, page).then(files => {
      setFiles(files);
      setProgress(100);
    });
  }, [user, page]);

  return (
    <Container>
      { Object.keys(user).length > 0 ? "" : <Redirect to="/auth/login" /> }

      <LoadingBar
        color="#007bff"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      /> 

      <h1>Dashboard</h1>
      <p>You're currently logged in as <strong>{user.username}</strong>.</p>

      <h2>User</h2>
      <Table striped bordered responsive>
        <tbody>
          <tr>
            <th>ID</th>
            <td>{user.id}</td>
          </tr>
          <tr>
            <th>Username</th>
            <td>{user.username}</td>
          </tr>
          <tr>
            <th>Email</th>
            <td>{user.email}</td>
          </tr>
          <tr>
            <th>API Key</th>
            <td>
              <code className="blurred-text" onClick={copyApiKey}>
                {user.apikey}
              </code>
            </td>
          </tr>
        </tbody>
      </Table>

      <h2>Files</h2>
      <PaginationBar
        totalRecords={fileCount}
        pageNeighbours={1}
        onPageChanged={onPageChanged}
      />
      <Table striped bordered responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Date</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr key={file.id}>
              <td>{file.id}</td>
              <td>
                <a href={Config.returnUrl + "/" + file.name} target="_blank" rel="noreferrer">
                  <code>
                    {file.name}
                  </code>
                </a>
              </td>
              <td>{strftime("%d/%m/%Y @ %H:%M:%S", new Date(file.date * 1000))}</td>
              <td>
                <Button variant="danger" onClick={() => askDeleteFile(file)}>
                  ×
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete File</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <a href={Config.returnUrl + "/" + deleteTarget.name} target="_blank" rel="noreferrer">{deleteTarget.name}</a>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={doDeleteFile}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default UserHome;