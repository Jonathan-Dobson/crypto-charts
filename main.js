async function getdata(file) {
  var subjectCoin = [];
  var data = [];
  try {
    const promise = await fetch(file);
    subjectCoin = await promise.json();
  } catch (error) {}

  data = await subjectCoin.reduce((prev, cur, idx, arr) => {
    return [
      ...prev,
      [new Date(cur.timestamp * 1000), cur.open, cur.open, cur.close, cur.open],
    ];
  }, []);

  await google.charts.load("current", { packages: ["corechart"] });
  await google.charts.setOnLoadCallback(drawChart(data));
}

function drawChart(data) {
  return () => {
    var chart = google.visualization.arrayToDataTable(data, true);

    var options = {
      // enableInteractivity: true,
      legend: "none",
      bar: { groupWidth: "100%" }, // Remove space between bars.
      candlestick: {
        fallingColor: { strokeWidth: 0, fill: "#a52714" }, // red
        risingColor: { strokeWidth: 0, fill: "#0f9d58" }, // green
      },
      chartArea: { top: 10, width: "90%", height: "90%" },
      // vAxis: {
      //   format: "short",
      // },
    };

    var chartElement = new google.visualization.CandlestickChart(
      document.getElementById("chart_div")
    );

    chartElement.draw(chart, options);
  };
}

function addOnClick(id) {
  document.getElementById(id).addEventListener("click", () => {
    getdata(`/data/${id}.json`);

    document.getElementById("title").innerText = id;
    document.getElementById(id).classList.add("active");
    var buttons = document.querySelectorAll("button");
    buttons.forEach((button) => {
      if (button.id !== id) {
        button.classList.remove("active");
      }
    });
  });
}

addOnClick("SOLXRP");
addOnClick("LTCXRP");
addOnClick("LINKXRP");
