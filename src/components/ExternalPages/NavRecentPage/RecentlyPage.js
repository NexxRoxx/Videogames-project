import classes from "./RecentlyPage.module.css";
import RecentlyPageItem from "./RecentlyPageItem";
import useFetch from "../../../hooks/useFetch";
import { useEffect, useState } from "react";
import Pagination from "../Pagination";
import FilterPage from "./FilterPage";
const RecentylPage = (props) => {
  // console.log(query.recentGames);
  const { isLoading, error, sendRequest: fetchGames } = useFetch();
  const [gamesArray, setGamesArray] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [resetPag, setResetPag] = useState(false);
  const postsPerPage = 16;
  const httpFields = `fields name,genres.name,aggregated_rating,cover.url,involved_companies.company.name,videos.video_id,screenshots.url,first_release_date,summary,platforms.name,similar_games.name,similar_games.cover.url,game_modes.name;`;
  // const httpConditions = `where name != null & genres.name != null & aggregated_rating != null & cover.url != null & videos.video_id != null;`;
  const gamesNumber = 400;
  const maxPages = gamesNumber / postsPerPage;
  const [filter, setFilter] = useState("");
  const httpConditions = `where first_release_date != null & name != null & genres.name != null & aggregated_rating != null & cover.url != null & platforms.name != null & videos.video_id != null & first_release_date < 1660770765 ${filter};`;
  const bodyStr = `${httpFields} sort first_release_date desc; ${httpConditions} limit ${gamesNumber};`;

  useEffect(() => {
    setCurrentPage(1);
    const getData = (data) => {
      setGamesArray((prev) => [...data]);
      console.log(data);
    };
    fetchGames(
      {
        // url: `https://cors-anywhere.herokuapp.com/https://api.igdb.com/v4/games`,
        url: `https://api.igdb.com/v4/games`,
        method: "POST",
        body: `${props.query + filter}; limit 400;`,
      },
      getData
    );
  }, [bodyStr, props.query]);

  // Get current posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentGames = gamesArray.slice(indexOfFirstPost, indexOfLastPost);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <div>
        <h3 className={classes.title}>{props.title}</h3>
        <FilterPage filterHandler={setFilter} />
      </div>
      <div className={classes.maincontainer}>
        {gamesArray.length > 0 ? (
          currentGames.map((item) => {
            return (
              <div className={classes.itemcontainer}>
                <RecentlyPageItem
                  // name={item.name}
                  // genre={item.genres[0].name}
                  // cover={item.cover.url}
                  // score={item.aggregated_rating}
                  name={item.name}
                  genre={item.genres}
                  cover={item.cover.url}
                  score={item.aggregated_rating}
                  // score={item.aggregated_rating}
                  date={item.first_release_date}
                  company={item.involved_companies}
                  screenshot={item.screenshots}
                  video={item.videos[0].video_id}
                  summary={item.summary}
                  platforms={item.platforms}
                  similar_games={item.similar_games}
                  game_modes={item.game_modes}
                  highlighted={props.highlighted}
                  highlightedType={props.highlightedType}
                />
              </div>
            );
          })
        ) : (
          <div>LOADING...</div>
        )}
      </div>
      <>
        <Pagination
          paginate={paginate}
          current={currentPage}
          maxPages={maxPages}
          resetPag={resetPag}
        />
      </>
    </>
  );
};

export default RecentylPage;
