import { Box, Select, FormControl, InputLabel, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";

const SelectOptions = ({
  provinsi,
  kota,
  kurir,
  layanan,
  alamat,
  provinces,
  cities,
  services,
}) => {
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [courier, setCourier] = useState("");
  const [service, setService] = useState("");
  const [address, setAddress] = useState("");

  const handleChangeProvince = (event) => {
    setProvince(event.target.value);
    provinsi(event.target.value);
  };
  const handleChangeCity = (event) => {
    setCity(event.target.value);
    kota(event.target.value);
  };
  const handleChangeCourier = (event) => {
    setCourier(event.target.value);
    kurir(event.target.value);
  };
  const handleChangeService = (event) => {
    setService(event.target.value);
    layanan(event.target.value);
  };
  const handleChangeAddress = (event) => {
    setAddress(event.target.value);
    alamat(event.target.value);
  };

  useEffect(() => {
    alamat(address);
  }, [address]);

  return (
    <Box
      sx={{
        minWidth: 120,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Provinsi</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={province}
          label="Provinsi"
          onChange={handleChangeProvince}
        >
          {provinces?.map((item) => (
            <MenuItem key={item.province_id} value={item.province_id}>
              {item.province}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Kota/Kabupaten</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={city}
          label="Kota/Kabupaten"
          onChange={handleChangeCity}
        >
          {cities?.map((item) => (
            <MenuItem key={item.city_id} value={item.city_id}>
              {`${item.type} ${item.city_name}`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Kurir</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={courier}
          label="Kurir"
          onChange={handleChangeCourier}
        >
          <MenuItem value="pos">POS</MenuItem>
          <MenuItem value="jne">JNE</MenuItem>
          <MenuItem value="tiki">TIKI</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Layanan</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={service}
          label="Layanan"
          onChange={handleChangeService}
        >
          {services?.map((item) => {
            if (!item?.cost?.[0]) {
              return null;
            }
            return (
              <MenuItem key={item?.service} value={item?.cost?.[0].value}>{`${
                item?.service || "Layanan"
              } Rp ${parseFloat(item?.cost?.[0].value).toLocaleString(
                "id-ID"
              )} ${item?.cost?.[0].etd || ""} Hari`}</MenuItem>
            );
          })}
        </Select>
      </FormControl>

      <textarea
        placeholder="Masukan Alamat"
        style={{ padding: "10px" }}
        value={address}
        onChange={handleChangeAddress}
      />
    </Box>
  );
};

export default SelectOptions;
