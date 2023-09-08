import React, { useState } from "react";
import {
  Container,
  Box,
  Paper,
  InputBase,
  IconButton,
  Stack,
  Button,
  Link,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  Checkbox,
  FormLabel,
  FormGroup,
  FormControl,
  FormControlLabel,
  Modal,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import logo from "@src/assets/logo.jpg";
import { Platform, DayOfWeek } from "@src/types";
import { tags, webtoons } from "@src/utils/constants";
import { WebtoonList, SignUp, SignIn } from "@src/components";

const Main = () => {
  const [platform, setPlatform] = useState<Platform>("all");
  const [dayOfWeeks, setDayOfWeeks] = useState<DayOfWeek[]>([]);
  const [signInOpen, setSignInOpen] = useState<boolean>(false);
  const [signUpOpen, setSignUpOpen] = useState<boolean>(false);
  const handleSignInOpen = () => setSignInOpen(true);
  const handleSignInClose = () => setSignInOpen(false);
  const handleSignUpOpen = () => setSignUpOpen(true);
  const handleSignUpClose = () => setSignUpOpen(false);

  const handleChange = (event: React.SyntheticEvent, value: Platform) => {
    setPlatform(value);
  };

  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDayOfWeeks([...dayOfWeeks, event.target.name as DayOfWeek]);
  };

  return (
    <Container maxWidth="xl">
      <Box component="header" sx={{ mt: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Link href="/">
            <Box component="img" sx={{ height: 80, width: 120, borderRadius: "10%" }} src={logo} />
          </Link>
          <Paper
            elevation={5}
            component="form"
            sx={{ display: "flex", alignItems: "center", width: 600 }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="검색어를 입력해주세요"
              inputProps={{ "aria-label": "search google maps" }}
            />
            <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
              <SearchIcon />
            </IconButton>
          </Paper>
          <Stack spacing={2} direction="row">
            <Modal
              open={signInOpen}
              onClose={handleSignInClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <SignIn />
            </Modal>
            <Modal
              open={signUpOpen}
              onClose={handleSignUpClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <SignUp />
            </Modal>
            <Button variant="contained" color="primary" onClick={handleSignInOpen}>
              Sign in
            </Button>
            <Button variant="contained" color="info" onClick={handleSignUpOpen}>
              Sign up
            </Button>
          </Stack>
        </Stack>
      </Box>
      <Container maxWidth="lg">
        <Box component="nav">
          <Tabs value={platform} onChange={handleChange} aria-label="webtoon platform tabs">
            <Tab label="전체" value="all" />
            <Tab label="네이버" value="naver" />
            <Tab label="카카오" value="kakao" />
            <Tab label="레진코믹스" value="lezhin" />
            <Tab label="탑툰" value="toptoon" />
            <Tab label="투믹스" value="toomics" />
          </Tabs>
        </Box>
        <Box sx={{ mt: 3 }}>
          <FormControl component="fieldset" variant="standard">
            <FormLabel>요일</FormLabel>
            <FormGroup row>
              <FormControlLabel
                control={<Checkbox onChange={handleToggle} name="Monday" />}
                label="월요웹툰"
              />
              <FormControlLabel
                control={<Checkbox onChange={handleToggle} name="Thuesday" />}
                label="화요웹툰"
              />
              <FormControlLabel
                control={<Checkbox onChange={handleToggle} name="Wednesday" />}
                label="수요웹툰"
              />
              <FormControlLabel
                control={<Checkbox onChange={handleToggle} name="Thursday" />}
                label="목요웹툰"
              />
              <FormControlLabel
                control={<Checkbox onChange={handleToggle} name="Friday" />}
                label="금요웹툰"
              />
              <FormControlLabel
                control={<Checkbox onChange={handleToggle} name="Saturday" />}
                label="토요웹툰"
              />
              <FormControlLabel
                control={<Checkbox onChange={handleToggle} name="Sunday" />}
                label="일요웹툰"
              />
              <FormControlLabel
                control={<Checkbox onChange={handleToggle} name="End" />}
                label="완결웹툰"
              />
            </FormGroup>
          </FormControl>
        </Box>
        <Box sx={{ mt: 3, mb: 3 }}>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>태그</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormControl component="fieldset" variant="standard">
                <FormGroup row>
                  {tags.map((tag) => (
                    <FormControlLabel
                      key={tag}
                      control={<Checkbox onChange={handleToggle} name={tag} />}
                      label={tag}
                    />
                  ))}
                </FormGroup>
              </FormControl>
            </AccordionDetails>
          </Accordion>
        </Box>
        <Box>
          <WebtoonList webtoons={webtoons} />
        </Box>
      </Container>
    </Container>
  );
};

export default Main;
