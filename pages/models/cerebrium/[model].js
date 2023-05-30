import {
  Container,
  Grid,
  VStack,
  GridItem,
  Box,
  Text,
  Heading,
} from "@chakra-ui/react";
import { ExternalLinkIcon, DollarSign, User, Robot } from "@chakra-ui/icons";
import MetaTags from "../../../components/MetaTags";
import PreviewImage from "../../../components/PreviewImage";

import {
  fetchModelDataById,
  fetchAllDataFromTable,
} from "../../../utils/modelsData.js";

import SimilarModelsTable from "../../../components/modelDetailsPage/SimilarModelsTable";
import CreatorModelsTable from "../../../components/modelDetailsPage/CreatorModelsTable";
import ModelDetailsTable from "../../../components/modelDetailsPage/ModelDetailsTable";
import ModelOverview from "../../../components/modelDetailsPage/ModelOverview";
import ModelPricingSummary from "../../../components/ModelPricingSummary";
import RunsHistoryChart from "../../../components/modelDetailsPage/RunsHistoryChart";

import calculateCreatorRank from "../../../utils/calculateCreatorRank";
import calculateModelRank from "../../../utils/calculateModelRank";

import { findSimilarModels } from "../../../utils/modelsData";
import { findCreatorModels } from "../../../utils/modelsData";

export async function getStaticPaths() {
  const modelsData = await fetchAllDataFromTable("cerebriumModelsData");

  const paths = modelsData.map((model) => ({
    params: { model: model.id.toString() },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const model = await fetchModelDataById(params.model, "cerebriumModelsData");
  const modelsData = await fetchAllDataFromTable("cerebriumModelsData");

  // Calculate model rank and creator rank
  const modelRank = calculateModelRank(modelsData, model.id);
  const creatorRank = calculateCreatorRank(modelsData, model.creator);

  // Add ranks to the model object
  const modelWithRanks = {
    ...model,
    modelRank,
    creatorRank,
  };

  return { props: { model: modelWithRanks, modelsData } };
}

export default function ModelPage({ model, modelsData }) {
  const similarModels = findSimilarModels(model, modelsData);
  const creatorModels = findCreatorModels(model, modelsData);

  return (
    <>
      <MetaTags
        title={`AI model details - ${model.modelName}`}
        description={`Details about the ${model.modelName} model by ${model.creator}`}
        ogModelDescription={model.description}
        creator={model.creator}
        modelName={model.modelName}
        ogImgUrl={model.example} // assuming 'ogImgUrl' is a property on the model object
        platform={model.platform} // assuming 'platform' is a property on the model object
        tags={model.tags} // assuming 'tags' is a property on the model object
        costToRun={model.costToRun} // assuming 'costToRun' is a property on the model object
        avgCompletionTime={model.avgCompletionTime} // assuming 'avgCompletionTime' is a property on the model object
        predictionHardware={model.predictionHardware} // assuming 'predictionHardware' is a property on the model object
      />
      <Box overflowX="hidden">
        <Container maxW="container.xl" py="12">
          <Grid
            templateColumns="repeat(auto-fit, minmax(300px, 1fr))"
            gap={{ base: 6, md: 10 }}
          >
            <GridItem>
              <VStack spacing={6} alignItems="start">
                <ModelOverview model={model} />
                <ModelPricingSummary model={model} />
                <CreatorModelsTable creatorModels={creatorModels} />
                <SimilarModelsTable similarModels={similarModels} />
              </VStack>
            </GridItem>
            <GridItem>
              <ModelDetailsTable model={model} />
              <RunsHistoryChart modelId={model.id} />
            </GridItem>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
