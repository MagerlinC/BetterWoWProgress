import "./App.scss";
import { useState } from "react";
import PlayerRow from "./components/player-row/player-row";
import LoadSpinner from "./components/load-spinner/load-spinner";
import Dropdown from "./components/dropdown/dropdown";
import Scrollbars from "react-custom-scrollbars";

function App() {
  const baseURL = "https://wowprogress.com/gearscore/";
  const query = "?lfg=1&raids_week=2&lang=en&sortby=ts";
  const SCRAPER_API_KEY = "946942b7fd1cda5b58d6402140844609";
  const corsBase = `http://api.scraperapi.com?api_key=${SCRAPER_API_KEY}&url=`;

  const playerClasses = [
    {
      className: "Death Knight",
      specs: ["Blood", "Frost", "Unholy"],
      classColor: "#C41E3A",
    },
    {
      className: "Demon Hunter",
      specs: ["Havoc", "Vengeance"],
      classColor: "#A330C9",
    },
    {
      className: "Druid",
      specs: ["Balance", "Guardian", "Feral", "Restoration"],
      classColor: "#FF7C0A",
    },
    {
      className: "Hunter",
      specs: ["Beastmastery", "Marksmanship", "Survival"],
      classColor: "#AAD372",
    },
    {
      className: "Mage",
      specs: ["Arcane", "Fire", "Frost"],
      classColor: "#3FC7EB",
    },
    {
      className: "Monk",
      specs: ["Brewmaster", "Mistweaver", "Windwalker"],
      classColor: "#00FF98",
    },
    {
      className: "Paladin",
      specs: ["Holy", "Protection", "Retribution"],
      classColo: "#F48CBA",
    },
    {
      className: "Priest",
      specs: ["Discipline", "Holy", "Shadow"],
      classColor: "#FFFFFF",
    },
    {
      className: "Rogue",
      specs: ["Assassination", "Outlaw", "Subtlety"],
      classColor: "#FFF468",
    },
    {
      className: "Shaman",
      specs: ["Elemental", "Enhancment", "Restoration"],
      classColor: "#0070DD",
    },
    {
      className: "Warlock",
      specs: ["Affliction", "Demonology", "Destruction"],
      classColor: "#8788EE",
    },
    {
      className: "Warrior",
      specs: ["Arms", "Fury", "Protection"],
      classColor: "#C69B6D",
    },
  ];

  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSpec, setSelectedSpec] = useState(null);

  const [fetchedPlayers, setFetchedPlayers] = useState([]);

  const [isFetching, setIsFetching] = useState(false);

  const cleanClassName = (className) => {
    return className.toLowerCase().replace(" ", "");
  };

  const cleanLocalURL = (url) => {
    const cleanUrl = url.replace("http://localhost:3000/", "");
    return cleanUrl;
  };

  const generateUrlFromClass = (playerClass) => {
    const endpoint =
      corsBase + baseURL + "class." + cleanClassName(playerClass);
    return endpoint + query;
  };

  const getPlayerFromHTMLElement = (trChildren) => {
    const player = {};
    if (trChildren) {
      const playerNameEl = trChildren[0];
      if (playerNameEl) {
        const tag = playerNameEl.getElementsByTagName("a")[0];
        if (tag) {
          player.name = tag.textContent;
          player.url = "https://wowprogress.com/" + cleanLocalURL(tag.href);
        }
      }
      const playerServerEl = trChildren[3];
      if (playerServerEl) {
        const tag = playerServerEl.getElementsByTagName("a")[0];
        if (tag) {
          player.server = tag.textContent;
        }
      }
    }
    return player;
  };

  const getWPResults = (endpoint) => {
    setIsFetching(true);
    const playersToAdd = [];
    fetch(endpoint).then((res) => {
      if (res.status === 200) {
        res.text().then((innerRes) => {
          const doc = new DOMParser().parseFromString(innerRes, "text/html");
          const WPTable = doc.getElementById("char_rating_container")
            .children[2];
          const tbody = WPTable.children[0];
          for (let tr of tbody.children) {
            const trChildren = tr.children;
            if (trChildren.length > 0) {
              const player = getPlayerFromHTMLElement(trChildren);
              if (player.name) {
                playersToAdd.push(player);
              }
            }
          }
          setIsFetching(false);
          console.log("DONE", playersToAdd);
          setFetchedPlayers(playersToAdd);
        });
      }
    });
  };
  return (
    <div className="App">
      <header className="App-header">Better WoWProgress</header>
      <div className={"selection-controls"}>
        <div className={"class-and-spec-selector"}>
          <h1 className={"selector-header"}>Select Player Class and Spec</h1>
          <div className={"selector-inputs"}>
            <div className={"class-selector"}>
              <Dropdown
                attributeName={"className"}
                onSelect={(playerClass) => {
                  setSelectedClass(playerClass);
                  // Clear spec when selecting new class
                  setSelectedSpec(null);
                }}
                dropdownItems={playerClasses}
                selectedItem={selectedClass}
                closedText="Select Class"
              />
            </div>
            <div className={"spec-selector"}>
              <Dropdown
                onSelect={(spec) => setSelectedSpec(spec)}
                dropdownItems={selectedClass ? selectedClass.specs : []}
                selectedItem={selectedSpec}
                closedText="Select Spec"
                locked={selectedClass == null}
              />
            </div>
          </div>
        </div>
        <button
          disabled={isFetching}
          onClick={() =>
            getWPResults(generateUrlFromClass(selectedClass.className))
          }
          className={"search-btn"}
        >
          Search
        </button>
      </div>
      {isFetching ? (
        <LoadSpinner />
      ) : (
        <div className={"results-wrapper"}>
          {fetchedPlayers.length > 0 && (
            <div className={"found-players-header"}>
              Found {fetchedPlayers.length} players
            </div>
          )}
          <Scrollbars
            hideTracksWhenNotNeeded={true}
            style={{
              height: Math.min(300, fetchedPlayers.length * 31.5),
            }}
          >
            <div className={"results"}>
              {fetchedPlayers.map((player) => (
                <PlayerRow
                  textColor={selectedClass ? selectedClass.classColor : null}
                  bgColor={"#282c34"}
                  key={player.name + "-" + player.server}
                  player={player}
                />
              ))}
            </div>
          </Scrollbars>
        </div>
      )}
    </div>
  );
}

export default App;
