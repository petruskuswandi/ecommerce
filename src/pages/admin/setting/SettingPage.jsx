import React, { Fragment } from "react";
import { useGetStoreDataQuery } from "../../../state/api/storeApi";
import { Grid, Typography } from "@mui/material";
import AdminBar from "../components/navbar/AdminBar";
import SettingStore from "./SettingStore";
import SettingAdmin from "./SettingAdmin";

const SettingPage = () => {
  const { data } = useGetStoreDataQuery();

  return (
    <Fragment>
      <AdminBar />

      <Grid
        container
        sx={{
          position: "relative",
          pl: { xs: 1, md: 4 },
          pr: { xs: 1, md: 4 },
        }}
      >
        <Grid item xs={12} md={6} sx={{ p: { xs: 1, md: 4 } }}>
          <SettingStore store={data} />
        </Grid>

        <Grid item xs={12} md={6} sx={{ p: { xs: 1, md: 4 } }}>
          <SettingAdmin />
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default SettingPage;
