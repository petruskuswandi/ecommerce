import { Box, Select, FormControl, InputLabel, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";

const SelectOptions = ({ provinsi, kota, kurir, layanan, alamat }) => {
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
    console.log(province);
    console.log(city);
    console.log(courier);
    console.log(service);
    console.log(address);
  }, [province, city, courier, service, address]);

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
          <MenuItem value="Jawa Barat">Jawa Barat</MenuItem>
          <MenuItem value="Jawa Tengah">Jawa Tengah</MenuItem>
          <MenuItem value="Jawa Timur">Jawa Timur</MenuItem>
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
          <MenuItem value="Cirebon">Cirebon</MenuItem>
          <MenuItem value="Bandung">Bandung</MenuItem>
          <MenuItem value="Jakarta">Jakarta</MenuItem>
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
          <MenuItem value="POS">POS</MenuItem>
          <MenuItem value="JNE">JNE</MenuItem>
          <MenuItem value="TIKI">TIKI</MenuItem>
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
          <MenuItem value="Layanan 1">Layanan 1</MenuItem>
          <MenuItem value="Layanan 2">Layanan 2</MenuItem>
          <MenuItem value="Layanan 3">Layanan 3</MenuItem>
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
