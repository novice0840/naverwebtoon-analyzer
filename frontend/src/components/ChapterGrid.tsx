import { Chapter, ChapterSort } from "@src/types/webtoon";
import { Grid, Paper } from "@mui/material";
import { Link } from "react-router-dom";
import { compareChapterConverter } from "@src/utils/compareChapter";

const ChapterGrid = ({ data, sortType }: { data: Chapter[]; sortType: ChapterSort }) => {
  return (
    <Grid container spacing={1}>
      {data
        ?.slice()
        .sort(compareChapterConverter[sortType])
        .map((chapter: Chapter) => (
          <Grid item xs={2} key={chapter.id}>
            <Paper elevation={5}>
              <Link style={{ textDecoration: "none" }} key={chapter.id} to={"/chapter/" + chapter.id.toString()}>
                <img src={chapter.thumbnail} width={106} height={62} alt="" />
                <div>{chapter.name}</div>
                <div>{chapter.uploadDate}</div>
                <div>평균 별점{chapter.averageStar}</div>
                <div>별점 총합{chapter.totalStar}</div>
              </Link>
            </Paper>
          </Grid>
        ))}
    </Grid>
  );
};

export default ChapterGrid;
