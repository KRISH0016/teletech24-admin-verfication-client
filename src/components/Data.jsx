import React, { useEffect, useState } from "react";

import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import Button from "@mui/material/Button";

import FileDownloadDoneIcon from "@mui/icons-material/FileDownloadDone";
import CloseIcon from "@mui/icons-material/Close";

import CircularProgress from "@mui/material/CircularProgress";

import { api } from "../api/api";

import { useNavigate } from "react-router-dom";

const columns = [
  { id: "sno", label: "S No", minWidth: 80 },
  { id: "email", label: "Email", minWidth: 50 },
  { id: "fullName", label: "Full Name", minWidth: 50 },
  { id: "phoneNumber", label: "Phone Number", minWidth: 50 },
  { id: "collegeName", label: "College Name", minWidth: 50 },
  { id: "department", label: "Department", minWidth: 50 },
  { id: "selectedDepartment", label: "Selected Event", minWidth: 50 },

  { id: "paid", label: "Payment confirmed", minWidth: 50 },
  { id: "transactionNumber", label: "Transaction Number", minWidth: 100 },
  { id: "confirm", label: "Confirm Payment", minWidth: 70 },
];

const Data = ({ updateForm, setUpdateForm }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [restartEffect, setRestartEffect] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/getData")
      .then((result) => {
        setRows(
          result.data
            .sort((a, b) => (a && !b ? 1 : -1))
            .sort((a, b) =>
              a.transactionNumber.length > b.transactionNumber.length ? -1 : 1
            )
        );
        setUpdateForm(false);
        setLoading(false);
      })
      .catch((err) => {
        //console.log(err);
        navigate("/");
      });
  }, [updateForm]);

  if (loading) {
    return (
      <div className={"w-full h-screen flex items-center justify-center"}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div>
      <div className="w-full">
        <Paper
          sx={{
            width: "100%",
            overflow: "hidden",
            padding: "20px",
          }}
        >
          <TableContainer
            sx={{ minHeight: "830px", overflow: "scroll" }}
            className={`h-[calc(100vh-90px)]`}
          >
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth, fontWeight: "bold" }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody sx={{ overflow: "scroll" }}>
                {rows.map((row, index) => {
                  // //console.log(row);
                  return (
                    <TableRow hover role="checkbox" key={index}>
                      {columns.map((column, newIndex) => {
                        if (column.id === "sno") {
                          return (
                            <TableCell key={newIndex}>{index + 1}</TableCell>
                          );
                        }
                        if (column.id === "paid") {
                          return (
                            <TableCell key={newIndex}>
                              {row[column.id] ? (
                                <FileDownloadDoneIcon color="success" />
                              ) : (
                                <CloseIcon color="error" />
                              )}
                            </TableCell>
                          );
                        }
                        if (column.id === "confirm") {
                          if (sessionStorage.getItem("user") === "admin") {
                            return (
                              <TableCell
                                key={newIndex}
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  width: "100px",
                                  gap: "10px",
                                }}
                              >
                                <Button
                                  variant="contained"
                                  color="success"
                                  sx={{ width: "20px", aspectRatio: "2/1" }}
                                  disabled={row["transactionNumber"] === ""}
                                  onClick={() => {
                                    setLoading(true);
                                    api
                                      .put("/update", {
                                        _id: row["_id"],
                                        paid: true,
                                        fullName: row["fullName"],
                                        email: row["email"],
                                        transactionNumber:
                                          row["transactionNumber"],
                                      })
                                      .then((result) => {
                                        setUpdateForm(true);
                                        setLoading(false);
                                      })
                                      .catch((err) => {
                                        //console.log(err);
                                      });
                                  }}
                                >
                                  <FileDownloadDoneIcon />
                                </Button>
                                <Button
                                  variant="contained"
                                  color="error"
                                  sx={{ width: "20px", aspectRatio: "2/1" }}
                                  disabled={row["transactionNumber"] === ""}
                                  onClick={() => {
                                    setLoading(true);
                                    api
                                      .put("/update", {
                                        _id: row["_id"],
                                        paid: false,
                                        fullName: row["fullName"],
                                        email: row["email"],
                                        transactionNumber: "",
                                      })
                                      .then((result) => {
                                        setUpdateForm(true);
                                        setLoading(false);
                                      })
                                      .catch((err) => {
                                        //console.log(err);
                                      });
                                  }}
                                >
                                  <CloseIcon />
                                </Button>
                              </TableCell>
                            );
                          } else {
                            return (
                              <TableCell key={newIndex}>Not Authorized</TableCell>
                            );
                          }
                        }
                        return (
                          <TableCell key={newIndex}>{row[column.id]}</TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </div>
    </div>
  );
};

export default Data;
