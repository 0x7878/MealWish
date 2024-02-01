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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import { useParams } from 'react-router-dom';
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
  const { id } = useParams();

  const [category, setCategory] = React.useState("");
  const [categories, setCategories] = React.useState<any[]>([]);
  const [name, setName] = React.useState("");
  const [imageURL, setImageURL] = React.useState("");
  const [categoryTouched, setCategoryTouched] = React.useState(false);
  const [nameTouched, setNameTouched] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const navigate = useNavigate();

  const handleChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value as string);
  };

const handleClickOpen = () => {
  setOpen(true);
};

const handleClose = () => {
  setOpen(false);
};
  //Get meal from API
  React.useEffect(() => {
    async function fetchData() {
      const endpoint = api_url + "meals/" + id;
      try {
        const data = await fetch(endpoint).then((response) => response.json());
        setName(data.name);
        setCategory(data.sectionId);
        setImageURL(data.image_url);
      } catch (e) {
        //todo show dialog / modal or something
        console.log(e);
      }
    }
    if (id) {
      fetchData();
    }
  }, [id]);


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

  const handleDelete = () => {
    const endpoint = api_url + "meals/" + id;
    fetch(endpoint, {
      method: "DELETE",
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
        image_url: imageURL, 
        sectionId: category,
      };

      // update if id is set

      if (id) {
        const endpoint = api_url + "meals/" + id;
        fetch(endpoint, {
          method: "PUT",
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
        return;
      }

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

  const title = id ? "Edit Meal" : "Add Meal";

  return (
    <>
      <DefaultAppBar title={title} />
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
            <CardHeader title={title} />
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

                  <Grid item xs={4} 
                        style={{ textAlign: "center" }} >
                    {id && (
                      <Button
                        variant="contained"
                        color="error"
                        startIcon={<DeleteForeverIcon />}
                        onClick={handleClickOpen}
                      >
                        Delete
                      </Button>
                    )}
                  </Grid>
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
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Are you sure?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This action will permanently delete the meal. Are you sure you want to proceed?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="primary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
