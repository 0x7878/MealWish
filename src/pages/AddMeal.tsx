import React from "react";
import { styled } from "@mui/material/styles";
import DefaultAppBar from "../layout/default-app-bar";
import Card from "@mui/material/Card";
import {
  Box,
  Button,
  CardContent,
  CardHeader,
  Container,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import api_url from "../config";
import { SaveOutlined } from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

const toolbarHeight = 55;
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

interface Meal {
  id?: string;
  name: string;
  image_url: string;
  sectionId: string;
}

export default function AddMeal(props: any) {
  const [category, setCategory] = React.useState("");
  const [categories, setCategories] = React.useState<any[]>([]);
  const [name, setName] = React.useState("");
  const [categoryTouched, setCategoryTouched] = React.useState(false);
  const [nameTouched, setNameTouched] = React.useState(false);

  const navigate = useNavigate();

  const handleChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value as string);
  };

  //Get all sections from API
  React.useEffect(() => {
    async function fetchData() {
      const endpoint = api_url + "sections";
      try {
        const data = await fetch(endpoint).then((response) => response.json());
        setCategories(data);
      } catch (e) {
        //todo show dialog / modal or something
        console.log(e);
      }
    }
    fetchData();
  }, []);

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name) {
      setNameTouched(true);
    }
    if (!category) {
      setCategoryTouched(true);
    }
    if (name && category) {
      //Save a meal
      const meal: Meal = {
        name: name,
        image_url: "",
        sectionId: category,
      };

      const endpoint = api_url + "meals";
      fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(meal),
      })
        .then((response) => response.json())
        .then((data) => {
          // console.log("Success:", data);
          // setName("");
          // setCategory("");
          navigate(-1);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  return (
    <>
      <DefaultAppBar title="Add Meal" />
      <Box
        style={{
          overflow: "auto",
          height: "calc(100vh - 56px)",
          marginTop: toolbarHeight + 1,
        }}
        sx={{ bgcolor: "background.paper" }}
      >
        <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
          <Card>
            <CardHeader title="Add Meal" />
            <CardContent>
              <form onSubmit={handleSave}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Just enter the name of the meal and upload a picture of
                      it. Please also choose a category for the meal.
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="name"
                      label="Name"
                      variant="outlined"
                      required
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      error={nameTouched && !name}
                      helperText={
                        nameTouched && !name ? "This field is required" : ""
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth error={categoryTouched && !category}>
                      <InputLabel id="category-select">Category *</InputLabel>
                      <Select
                        labelId="category-select"
                        id="category-select"
                        value={category}
                        label="Category"
                        required
                        onChange={handleChange}
                      >
                        {categories.map((category) => (
                          <MenuItem key={category.id} value={category.id}>
                            {category.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {categoryTouched && !category && (
                        <FormHelperText>This field is required</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <Button
                      component="label"
                      variant="contained"
                      startIcon={<CloudUploadIcon />}
                    >
                      Upload file
                      <VisuallyHiddenInput type="file" />
                    </Button>
                  </Grid>

                  <Grid item xs={4}></Grid>
                  <Grid item xs={4} style={{ textAlign: "right" }}>
                    <Button
                      variant="contained"
                      color="secondary"
                      type="submit"
                      startIcon={<SaveOutlined />}
                    >
                      Save
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </>
  );
}
