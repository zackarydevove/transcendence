import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#6366f1"
    }
  },
  components: {
    MuiButton: {
      defaultProps: {
        className: "rounded-md"
      }
    }
  }
});

export default theme;