// @ts-nocheck
import React, { useState } from "react";

// mui
import {
  Box,
  FormControl,
  Grid,
  IconButton,
  LinearProgress,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import DirectionsIcon from "@mui/icons-material/Directions";

// react query
import Paper from "@mui/material/Paper";

const COMPONENT_NAME = "image_generation_component";

const ImageGridContainer = styled(Grid)(({ theme }) => {
  return {
    maxWidth: 700,
    minHeight: "70vh",
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
    margin: "0 auto",
  };
});

const Item = styled(Paper)(({ theme }) => ({
  // backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  // backgroundColor: "#e5e4e4",
  // padding: theme.spacing(1),
  ...theme.typography.body2,
  textAlign: "center",
  color: theme.palette.text.secondary,
  transition: "transform 0.3s",
  "&:hover, &:focus": {
    transform: "scale(1.05)",
    cursor: "pointer",
  },
}));

interface Image {
  title: string;
  rows?: number;
  cols?: number;
  data: string;
}

function srcset(image: string, size: number, rows = 1, cols = 1) {
  return {
    // src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
    src: `${image}`,
    // srcSet: `${image}?w=${size * cols}&h=${
    //   size * rows
    // }&fit=crop&auto=format&dpr=2 2x`,
  };
}

const ImageGeneration = () => {
  const [userInput, setUserInput] = useState("");
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(false);

  /*const imageGenerationMutation = useMutation({
      mutationFn: (userInput: string) => {
        setLoading(true);
        return handleOpenAIAPI({
          type: openAIAPIEnum.GENERATE_IMAGE,
          data: userInput,
        });
      },
      onSuccess: (data, userInput, context) => {
        console.log(data);
        if (!Array.isArray(data)) return;
  
        const images: Image[] = data.map((imageString, index) => {
          return {
            data: imageString,
            title: `${userInput} - ${index}`,
            rows: 1,
            cols: 1,
          };
        });
  
        setLoading(false);
        setImages(images);
        setUserInput("");
      },
      onError: (error) => {
        console.error(error);
      },
    });*/

  const handleInput = (e: any) => {
    e.preventDefault();
    setUserInput(e.target.value);
  };

  const handleSubmitInput = async (e: any) => {
    e.preventDefault();
    // await imageGenerationMutation.mutate(userInput);
  };

  const handleKeyDown = async (e: any) => {
    if (e.key === "Enter") {
      await handleSubmitInput(e);
    }
  };

  const renderLoadingBar = () => {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          width: "80%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          margin: "0 auto",
        }}
      >
        <LinearProgress />
      </Box>
    );
  };

  const renderImageContainer = () => {
    return (
      <ImageGridContainer
        data-testid={`${COMPONENT_NAME}_image_grid_container`}
        container
        spacing={2}
      >
        {images.map((image, index) => (
          <Grid key={index} item xs={4}>
            <Item elevation={0} variant="outlined">
              <img
                {...srcset(image.data, 50, image.rows, image.cols)}
                alt={image.title}
                loading="lazy"
              />
            </Item>
          </Grid>
        ))}
      </ImageGridContainer>
    );
  };
  const renderUserInputBox = () => {
    return (
      <FormControl data-testid={`${COMPONENT_NAME}_form`} fullWidth>
        <TextField
          fullWidth
          label="enter something..."
          data-testid={`${COMPONENT_NAME}_chat_box`}
          value={userInput}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          InputProps={{
            endAdornment: (
              <IconButton
                color="primary"
                aria-label="directions"
                sx={{ position: "absolute", right: 2, bottom: 4 }}
                onClick={handleSubmitInput}
              >
                <DirectionsIcon />
              </IconButton>
            ),
          }}
        />
      </FormControl>
    );
  };

  return (
    <Box
      data-testid={COMPONENT_NAME}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        height: {
          md: "80vh", // Default height for screens less than 1500px
          lg: "95vh", // Height for screens 1500px and greater
        },
      }}
    >
      {loading && renderLoadingBar()}
      {!loading && renderImageContainer()}
      {renderUserInputBox()}
    </Box>
  );
};

export default ImageGeneration;
