import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { CampaignContext } from "../contexts/CampaignContext";
import { useHistory, useParams } from "react-router-dom";
import LoopRoundedIcon from "@material-ui/icons/LoopRounded";
import moment from "moment";
import Header from "./Header";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";

const ShowCampaign = () => {
  let history = useHistory();
  let { id: cId } = useParams();
  const { campaign, setCampaign } = useContext(CampaignContext);
  const [modalOpen, setModalOpen] = useState(false);
  let [error, setError] = useState("success");
  let [modelContent, setModelContent] = useState(`Link Copied`);

  function BasicAlerts() {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Stack sx={{ width: "40%", alignContent: "center" }} spacing={2}>
          <Alert
            variant="filled"
            severity={error}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  if (modelContent === "Link Copied") {
                    setModalOpen(false);
                  } else {
                    setModalOpen(false);
                    history.push("/campaigns");
                  }
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            sx={{ mb: 2 }}
          >
            {modelContent}
          </Alert>
        </Stack>
      </div>
    );
  }

  let itemInfo = null;
  if (!campaign) {
    history.push("/campaigns");
  } else {
    itemInfo = campaign.campaignItems.map((item, index) => {
      let donations =
        campaign.donationItems
          .filter((el) => el.item_name === item.campaign_item_name)
          .reduce((acc, cur) => acc + cur.item_quantity, 0) || 0;

      return {
        name: item.campaign_item_name,
        goal: item.campaign_item_quantity,
        donated: donations,
        needed: item.campaign_item_quantity - donations,
      };
    });
  }

  // delete campaign by id

  function deleteCampaign(e) {
    let token = JSON.parse(sessionStorage.getItem("accessToken"));
    let user = JSON.parse(sessionStorage.getItem("user"));
    e.preventDefault();
    !user
      ? history.push("/log-in")
      : fetch(`https://love-your-city-app.herokuapp.com/campaigns/${cId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            setModelContent("Campaign Deleted");
            setModalOpen(true);
          })
          .catch((e) => {
            console.log(e);
            setError("error");
            setModalOpen(true);
          });
  }

  // get campaign by id
  useEffect(() => {
    // let token = JSON.parse(sessionStorage.getItem("accessToken"));
    let user = JSON.parse(sessionStorage.getItem("user"));

    !user && history.push("/log-in");
    // : fetch(`http://localhost:5000/campaigns/${cId}`, {
    //     method: "GET",
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   })
    //     .then((res) => res.json())
    //     .then((res) => {
    //       console.log(res)
    //       setCampaign(res);
    //     })
    //     .catch((error) => {
    //       history.push("/campaigns");
    //       console.log(error);
    //     });
  }, [history, setCampaign, cId]);

  return (
    <React.Fragment>
      <Header />
      {modalOpen && <BasicAlerts />}
      <div className="sh-group">
        {campaign ? (
          <>
            <div className="sh-header">
              <h3> {campaign.campaign_title}</h3>
              {/* <h4>Hosted by: Erick Mulindi</h4> */}
            </div>
            <div className="sc-buttons">
              <button
                className="cb cb-1 share-3"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `https://www.loveyourcity.app/donate/${cId}`
                  );
                  setModalOpen(true);
                  // alert("Link Copied");
                }}
              >
                Copy Sharable link
              </button>

              <button className="cb cb-2 share-3" onClick={deleteCampaign}>
                Delete
              </button>
              <button className="cb cb-2 disabled">Edit</button>
            </div>
            <div className="sh-details-group">
              <div className="sh-desc">
                <h3>About this campaign</h3>
                <p>{campaign.campaign_desc}</p>
              </div>
              <div className="sh-details">
                <h3 className="sh-desc">List of items needed</h3>
                <div className="table-group">
                  <div className="row header-row">
                    <div className="col">No.</div>
                    <div className="col">Item Name</div>
                    <div className="col">Campaign Goal</div>
                    <div className="col">Donated</div>
                    <div className="col">Still Needed</div>
                  </div>

                  {itemInfo.map((mapItem, index) => {
                    const { name, goal, donated, needed } = mapItem;

                    return (
                      <div className="row" key={index}>
                        <div className="col">{index + 1}</div>
                        <div className="col">{name}</div>
                        <div className="col">{goal}</div>
                        <div className="col">{donated}</div>
                        <div className="col">{needed}</div>
                      </div>
                    );
                  })}
                </div>
                {/* <p className="share-1">Social Share:</p>
          <div className="social-share">
            <FacebookIcon style={{ fontSize: 40 }} />
            <TwitterIcon style={{ fontSize: 40 }} />
            <LinkedInIcon style={{ fontSize: 40 }} />
            <WhatsAppIcon style={{ fontSize: 40 }} />
          </div> */}
                {campaign.donationItems && (
                  <>
                    <h3 className="sh-desc">Donations</h3>
                    <div className="table-group-donations">
                      <div className="row header-row">
                        <div className="col">Gifter</div>
                        <div className="col">Item</div>
                        <div className="col">Donated</div>
                        <div className="col">Donated On</div>
                      </div>

                      {campaign.donationItems.map((el, index) => {
                        const {
                          item_name: name,
                          item_quantity: quan,
                          email,
                          created_at: date,
                        } = el;

                        return (
                          <div className="row" key={index}>
                            <div className="col">{email.split("@")[0]}</div>
                            <div className="col">{name}</div>
                            <div className="col">{quan}</div>
                            <div className="col">
                              {moment(date).format("DD MMMM YYYY")}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}

                <div className="table-group-2">
                  <div className="date">
                    <p className="header">End Date</p>
                    <p>{moment(campaign.end_date).format("DD MMMM YYYY")}</p>
                  </div>
                  <div className="address">
                    <p className="header">Delivery Address</p>
                    <p>{campaign.delivery_address}</p>
                  </div>
                  <div className="email">
                    <p className="header">Campaign Owner Email</p>
                    <p>{campaign.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <LoopRoundedIcon />
        )}
      </div>
    </React.Fragment>
  );
};

export default ShowCampaign;
