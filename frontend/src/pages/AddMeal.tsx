import React, { useEffect, useRef, useState } from "react";
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
  DialogContent, DialogContentText, DialogTitle,
  Fab,
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
import EditIcon from '@mui/icons-material/Edit';
import api_url from "../config";
import { SaveOutlined } from "@mui/icons-material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import { useLocation, useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import placeholder from "../other/base64_placeholder";
import { t } from "i18next";

const toolbarHeight = 55;

interface Meal {
  id?: string;
  name: string;
  description?: string;
  image_url: string;
  sectionId: string;
}

export default function AddMeal(props: any) {
  const { id } = useParams();

  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [categoryTouched, setCategoryTouched] = useState(false);
  const [nameTouched, setNameTouched] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const handleFileChange = (event: any) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      setImageURL(e.target?.result as string);
    };
    reader.readAsDataURL(event.target.files[0]);
    setSelectedFile(event.target.files[0]);
  };

  const handleFabClick = () => {
    if (fileInputRef.current)
      fileInputRef.current.click();
  };

  const handleCatergoryChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value as string);
  };

  //Get meal from API if id is present
  useEffect(() => {
    async function fetchData() {
      const endpoint = api_url + "meals/" + id;
      try {
        const data = await fetch(endpoint).then((response) => response.json());
        setName(data.name);
        setCategory(data.sectionId);
        setImageURL(data.image_url);
        setDescription(data.description);
      } catch (e) {
        // TODO: show dialog / modal or something
        console.log(e);
      }
    }
    if (id) {
      fetchData();
    }
  }, [id]);


  //Get all sections (Categories) from API
  useEffect(() => {
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
      .then((_data) => {
        navigate(-1);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  const handleSave = async (event: any) => {
    event.preventDefault();
    var image_url = "";

    if (selectedFile) {
      const formData = new FormData();
      formData.append("image", selectedFile);
      const result = await fetch(api_url + "upload", {
        method: "POST",
        body: formData,
      }).then((response) => response.json());
      if (result.path) {
        image_url = api_url + result.path;
        console.log("saved in " + api_url + result.path);
      }
    }
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
        image_url: (image_url ? image_url : imageURL),
        description: description,
        sectionId: category,
      };

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
          .then((_data) => {
            // go back home if there is a state otherwise go back to the previous page
            if(location?.state)
              navigate("../", {state: location?.state});
            else
              navigate(-1);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
        return;
      }

      //Add a new meal
      const endpoint = api_url + "meals";
      fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(meal),
      })
        .then((response) => response.json())
        .then((_data) => {
          navigate(-1);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  const title = id ? t("Edit Meal") : t("Add Meal");

  return (
    <>
      <DefaultAppBar title={title} state={location?.state} />
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
                      {t('Just enter the name of the meal and upload a picture of')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('it. Please also choose a category for the meal.')}
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
                        nameTouched && !name ? t('This field is required') : ""
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth error={categoryTouched && !category}>
                      <InputLabel id="category-select">{t('Category')} *</InputLabel>
                      <Select
                        labelId="category-select"
                        id="category-select"
                        value={category}
                        label={t('Category')}
                        required
                        onChange={handleCatergoryChange}
                      >
                        {categories.map((category) => (
                          <MenuItem key={category.id} value={category.id}>
                            {category.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {categoryTouched && !category && (
                        <FormHelperText>{t('This field is required')}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="description"
                      label={t('Description')}
                      variant="outlined"
                      value={description}
                      onChange={(event) => setDescription(event.target.value)}
                      multiline
                      rows={4}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <fieldset
                      style={{
                        margin: 0,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: "4px",
                        borderWidth: "1px",
                        borderColor: "#525252",
                        position: "relative",
                      }}
                    >
                      <legend style={{ color: "#bcbcbc" }}>
                        <Typography sx={{ fontSize: "13px" }}>{t('Image')}</Typography>
                      </legend>
                      <img
                        src={imageURL ? imageURL : placeholder}
                        alt="meal"
                        style={{ maxHeight: "300px" }}
                      />

                      <Fab
                        size="small"
                        color="secondary"
                        aria-label="Upload file"
                        onClick={handleFabClick}
                        style={{
                          position: "absolute",
                          bottom: "8px",
                          right: "8px"
                        }}
                      >
                        <EditIcon />
                        <input type="file" ref={fileInputRef} hidden onChange={handleFileChange} />
                      </Fab>
                    </fieldset>
                  </Grid>
                  <Grid item xs={12} style={{ textAlign: "right" }}>
                    {id && (
                      <Button
                        variant="contained"
                        color="error"
                        startIcon={<DeleteForeverIcon />}
                        onClick={() => setShowDeleteDialog(true)}
                        sx={{ marginRight: "8px" }}
                      >
                        {t('Delete')}
                      </Button>
                    )}
                    <Button
                      variant="contained"
                      type="submit"
                      startIcon={<SaveOutlined />}
                    >
                      {t('Save')}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Container>
      </Box>
      <Dialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{t('Are you sure?')}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t('This action will permanently delete the meal. Are you sure you want to proceed?')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)} color="primary">
            {t('Cancel')}
          </Button>
          <Button onClick={handleDelete} color="primary" autoFocus>
            {t('Delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
