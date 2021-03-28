import axios from "axios";
import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { useStateValue } from "../../StateProvider";
import { useHistory, useLocation } from "react-router-dom";
import $ from "jquery";
import Pusher from "pusher-js";

const Dashboard = () => {
  const [{ user }, dispatch] = useStateValue();
  const history = useHistory();
  const location = useLocation();

  //States
  const [DMSConnections, setDMSConnections] = useState(
    location.state.connections
  );
  const [active, setActive] = useState(-1);
  const [connectionEmail, setConnectionEmail] = useState("");

  //Effects
  useEffect(() => {
    const pusher = new Pusher("11a8dd35181269e15a84", {
      cluster: "ap2",
    });

    const channel = pusher.subscribe("users");

    channel.bind("removeconnection", (data) => {
      const newConnections = DMSConnections.filter((connection) => {
        return connection.email !== data.email;
      });

      setDMSConnections(newConnections);
    });
  }, [DMSConnections]);

  //Handlers
  const goToDirectMessages = async () => {
    history.push({
      pathname: "/directmessages",
      state: {
        user: user,
        connections: location.state.connections,
        allMessages: [],
      },
    });
  };

  const goToEmails = async () => {
    history.push({
      pathname: "/emails",
      state: {
        user: user,
        connections: location.state.connections,
        emailMessages: [],
      },
    });
  };

  const fetchChat = async (email, connectionemail) => {
    const response = await axios.post("/fetchalldirectmessages", {
      email: email,
      connectionemail: connectionemail,
    });

    await axios.post("/directmessagesseen", {
      email: email,
      connectionemail: connectionemail,
    });

    history.push({
      pathname: "/directmessages",
      state: {
        user: user,
        connections: location.state.connections,
        allMessages: response.data.allMessages,
      },
    });
  };

  const fetchEmail = async (email, connectionemail) => {
    const response = await axios.post("/fetchallemails", {
      email: email,
      connectionemail: connectionemail,
    });

    await axios.post("/emailsseen", {
      email: email,
      connectionemail: connectionemail,
    });

    history.push({
      pathname: "/emails",
      state: {
        user: user,
        connections: location.state.connections,
        emailMessages: response.data.emailMessages,
      },
    });
  };

  return (
    <div className="Dashboard__container">
      <div className="Dashboard__directmessages Dashboard__row">
        <div className="row Dashboard__row_header">
          <div className="col-10 text-center">
            <h3>Direct Messages</h3>
          </div>
          <div className="col Dashboard__row_icon">
            <i
              onClick={goToDirectMessages}
              className="fa fa-external-link-square"
            ></i>
          </div>
        </div>
        {DMSConnections.length > 0 ? (
          DMSConnections.map((connection, ind) => {
            return (
              <div
                className="Dashboard__DM_container"
                onClick={() => {
                  setConnectionEmail(connection.email);
                  fetchChat(user.email, connection.email);
                }}
                key={ind}
              >
                <div className="row p-0 mt-2 m-0">
                  <div className="col-2">
                    <img
                      src={connection.avatarUrl}
                      alt={connection.displayname}
                    />
                  </div>
                  <div className="col-8">
                    <h5>{connection.email}</h5>
                  </div>
                  <div className="col-2">
                    <p style={{ float: "right" }}>{connection.unseen}</p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div
            className="div"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <h4
              style={{
                textShadow: "1px 1px white",
                fontWeight: "bold",
              }}
            >
              No Connections...
            </h4>
          </div>
        )}
      </div>

      <div className="Dashboard__directmessages Dashboard__row">
        <div className="row Dashboard__row_header">
          <div className="col-10 text-center">
            <h3>Emails </h3>
          </div>
          <div className="col Dashboard__row_icon">
            <i onClick={goToEmails} className="fa fa-external-link-square"></i>
          </div>
        </div>
        {DMSConnections.length > 0 ? (
          DMSConnections.map((connection, ind) => {
            return (
              <div
                className="Dashboard__DM_container"
                onClick={() => {
                  setConnectionEmail(connection.email);
                  fetchEmail(user.email, connection.email);
                }}
                key={ind}
              >
                <div className="row p-0 mt-2 m-0">
                  <div className="col-2">
                    <img
                      src={connection.avatarUrl}
                      alt={connection.displayname}
                    />
                  </div>
                  <div className="col-8">
                    <h5>{connection.email}</h5>
                  </div>
                  <div className="col-2">
                    <p style={{ float: "right" }}>{connection.unseenemail}</p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div
            className="div"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <h4
              style={{
                textShadow: "1px 1px white",
                fontWeight: "bold",
              }}
            >
              No Connections...
            </h4>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
