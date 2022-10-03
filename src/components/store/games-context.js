import React, { useState, useEffect } from "react";
import useFetch from "../../hooks/useFetch";

const GamesContext = React.createContext({
  mainGames: [],
  recentlyGames: [],
  gamesByPlatform: [],
  newExternalWindow: false,
  newWindow: false,
  newFuckingWindow: "",
});

const fields = `fields name,genres.name,aggregated_rating,cover.url,involved_companies.company.name,videos.video_id,screenshots.url,first_release_date,summary,platforms.name,similar_games.name,similar_games.cover.url,similar_games.genres.name,game_modes.name;`;
const nullExcludeStr = `where name != null & genres.name != null & aggregated_rating != null & cover.url != null & videos.video_id != null`;
const newMainQuery = `query games "Main Games" {${fields}
    sort total_rating desc; ${nullExcludeStr} & first_release_date > 1654636672;limit 15;};`;

const recentHttpStr = `query games "Recentlys" {${fields} sort first_release_date desc; where first_release_date != null; ${nullExcludeStr} & first_release_date < 1660770765; limit 15;};`;

const platformsHttpStr = `query games "PS4 Games" {${fields} sort first_release_date desc;
               ${nullExcludeStr} & first_release_date < 1660770765 & release_dates.platform = 48; limit 10;};
               query games "XBOX Games" {${fields} sort first_release_date desc;
               ${nullExcludeStr} & first_release_date < 1660770765 & release_dates.platform = 49; limit 10;};
               query games "PC Games" {${fields} sort first_release_date desc;
               ${nullExcludeStr} & first_release_date < 1660770765 & release_dates.platform = 6; limit 10;};
               query games "SWITCH Games" {${fields} sort first_release_date desc;
               ${nullExcludeStr} & first_release_date < 1660770765 & release_dates.platform = 130; limit 10;};`;

const bodyHttpStr = `${newMainQuery + recentHttpStr + platformsHttpStr}`;

const getGames = (data) => {
  const mainGamesList = [];
  const recentList = [];
  const platformList = [];
  console.log(data);
  for (const item of data[0].result) {
    mainGamesList.push({
      name: item.name,
      genre: item.genres,
      review: item.aggregated_rating,
      cover: `https:${item.cover.url}`,
      date: item.first_release_date,
      company: item.involved_companies[0].company.name,
      screenshot: item.screenshots,
      video: item.videos[0].video_id,
      summary: item.summary,
      platforms: item.platforms,
      similar_games: item.similar_games,
      game_modes: item.game_modes,
    });
  }
  for (const item of data[1].result) {
    recentList.push({
      name: item.name,
      genre: item.genres,
      review: item.aggregated_rating,
      cover: `https:${item.cover.url}`,
      date: item.first_release_date,
      company: item.involved_companies[0].company.name,
      screenshot: item.screenshots,
      video: item.videos[0].video_id,
      summary: item.summary,
      platforms: item.platforms,
      similar_games: item.similar_games,
      game_modes: item.game_modes,
    });
  }

  platformList.push(
    { ps4: data[2].result },
    { xbox: data[3].result },
    { pc: data[4].result },
    { switch: data[5].result }
  );
  return [mainGamesList, recentList, platformList];
};

export const GamesContextProvider = (props) => {
  const [itemsList, setItemsList] = useState([]);
  const [newWindows, setNewWindows] = useState(false);
  const [newExternalWindow, setNewExternalWindow] = useState(false);
  const [currentGame, setCurrentGame] = useState([]);
  const { isLoading, error, sendRequest: fetchGames } = useFetch();
  const [newFuckingWindow, setNewFuckingWindow] = useState("");
  const [navMobState, setNavMobState] = useState(false);
  useEffect(() => {
    console.log("HI!  ");
    const getMain = (data) => {
      const gamesData = getGames(data);
      setItemsList((prev) => [...gamesData]);
    };
    fetchGames(
      {
        // url: "https://cors-anywhere.herokuapp.com/https://api.igdb.com/v4/multiquery",
        url: "https://api.igdb.com/v4/multiquery",
        method: "POST",
        body: bodyHttpStr,
      },
      getMain
    );
    console.log(itemsList);
  }, []);

  const popUpWindow = () => {
    setNewWindows((prevState) => !prevState);
  };

  const popUpExternalWindow = () => {
    setNewExternalWindow((prevState) => !prevState);
  };

  const setCurrentGames = (game) => {
    setCurrentGame((prev) => [game]);
  };

  const setSomeBullShite = (window) => {
    setNewFuckingWindow((prev) => window);
  };

  const contextValue = {
    mainGames: itemsList[0],
    recentlyGames: itemsList[1],
    gamesByPlatform: itemsList[2],
    newWindow: newWindows,
    setNewWindows: popUpWindow,
    newExternalWindow,
    setNewExternalWindow: popUpExternalWindow,
    newFuckingWindow,
    setNewFuckingWindow: setSomeBullShite,
    isLoading,
    currentGame,
    setCurrentGames,
    navMobState,
    setNavMobState,
  };

  return (
    <GamesContext.Provider value={contextValue}>
      {props.children}
    </GamesContext.Provider>
  );
};

export default GamesContext;