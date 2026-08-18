let dashboardRequestId = 0;


document.addEventListener(
  "DOMContentLoaded",
  initializeDashboard
);


function initializeDashboard() {

  setupStaticContent();

  setupFilters();

  loadDashboard();

}


function setupStaticContent() {

  const systemButton =
    document.getElementById(
      "systemButton"
    );


  if (systemButton) {

    systemButton.href =
      DASHBOARD_CONFIG.systemUrl;

  }


  const logo =
    document.getElementById(
      "projectLogo"
    );


  const fallback =
    document.getElementById(
      "logoFallback"
    );


  if (logo) {

    logo.src =
      "https://drive.google.com/thumbnail?id=" +
      encodeURIComponent(
        DASHBOARD_CONFIG.logoFileId
      ) +
      "&sz=w1000";


    logo.onload =
      function () {

        if (fallback) {

          fallback.style.display =
            "none";

        }

      };


    logo.onerror =
      function () {

        this.style.display =
          "none";

      };

  }


  renderLinkCards(
    "linksGrid",
    DASHBOARD_CONFIG.links || []
  );


  renderLinkCards(
    "videosGrid",
    DASHBOARD_CONFIG.videos || []
  );

}


function setupFilters() {

  const thirdSelect =
    document.getElementById(
      "thirdSelect"
    );


  const yearSelect =
    document.getElementById(
      "yearSelect"
    );


  const refreshButton =
    document.getElementById(
      "refreshDashboardButton"
    );


  const now =
    new Date();


  const month =
    now.getMonth() + 1;


  const currentThird =
    month <= 4
      ? "الاول"
      : (
          month <= 8
            ? "الثاني"
            : "الثالث"
        );


  if (thirdSelect) {

    thirdSelect.value =
      currentThird;


    thirdSelect.addEventListener(
      "change",
      loadDashboard
    );

  }


  if (yearSelect) {

    const currentYear =
      now.getFullYear();


    const firstYear =
      Number(
        DASHBOARD_CONFIG.firstYear ||
        2026
      );


    for (
      let year =
        currentYear;
      year >=
        firstYear;
      year--
    ) {

      const option =
        document.createElement(
          "option"
        );


      option.value =
        String(
          year
        );


      option.textContent =
        String(
          year
        );


      yearSelect.appendChild(
        option
      );

    }


    yearSelect.value =
      String(
        currentYear
      );


    yearSelect.addEventListener(
      "change",
      loadDashboard
    );

  }


  if (refreshButton) {

    refreshButton.addEventListener(
      "click",
      loadDashboard
    );

  }

}


function loadDashboard() {

  const third =
    document.getElementById(
      "thirdSelect"
    )
    ?.value ||
    "الثاني";


  const year =
    document.getElementById(
      "yearSelect"
    )
    ?.value ||
    "2026";


  setDashboardLoading(
    true
  );


  const requestId =
    ++dashboardRequestId;


  const callbackName =
    "__akhlaqiatDashboardCallback_" +
    requestId;


  window[
    callbackName
  ] =
    function (
      response
    ) {

      cleanupJsonp(
        callbackName,
        script
      );


      if (
        requestId !==
        dashboardRequestId
      ) {

        return;

      }


      if (
        !response ||
        !response.success
      ) {

        showDashboardError(
          response?.message ||
          "تعذر تحميل بيانات Dashboard."
        );

        setDashboardLoading(
          false
        );

        return;

      }


      renderDashboard(
        response
      );


      setDashboardLoading(
        false
      );

    };


  const script =
    document.createElement(
      "script"
    );


  const query =
    new URLSearchParams({

      action:
        "publicDashboard",

      third:
        third,

      year:
        year,

      callback:
        callbackName,

      t:
        Date.now()
    });


  script.src =
    DASHBOARD_CONFIG.apiUrl +
    "?" +
    query.toString();


  script.async =
    true;


  script.onerror =
    function () {

      cleanupJsonp(
        callbackName,
        script
      );


      if (
        requestId !==
        dashboardRequestId
      ) {

        return;

      }


      showDashboardError(
        "تعذر الاتصال بمنظومة أخلاقيات. تأكد من نشر آخر Version من Apps Script."
      );


      setDashboardLoading(
        false
      );

    };


  document.body.appendChild(
    script
  );

}


function cleanupJsonp(
  callbackName,
  script
) {

  try {

    delete window[
      callbackName
    ];

  }
  catch (
    ignored
  ) {

    window[
      callbackName
    ] =
      undefined;

  }


  if (
    script &&
    script.parentNode
  ) {

    script.parentNode
      .removeChild(
        script
      );

  }

}


function renderDashboard(
  data
) {

  const summary =
    data.summary ||
    {};


  setText(
    "metricContestants",
    formatNumber(
      summary.totalContestants
    )
  );


  setText(
    "metricParticipations",
    formatNumber(
      summary.totalParticipations
    )
  );


  setText(
    "metricAccepted",
    formatNumber(
      summary.acceptedParticipations
    )
  );


  setText(
    "metricRejected",
    formatNumber(
      summary.rejectedParticipations
    )
  );


  setText(
    "metricPoints",
    formatNumber(
      summary.totalPoints
    )
  );


  setText(
    "metricCeremonies",
    formatNumber(
      summary.totalCeremonies
    )
  );


  setText(
    "metricHonored",
    formatNumber(
      summary.totalActualHonored
    ) +
    " / " +
    formatNumber(
      summary.totalUploadedHonored
    )
  );


  setText(
    "metricBonus",
    formatNumber(
      summary.totalBonus
    )
  );


  setText(
    "honoringMatchText",
    "نسبة المطابقة " +
    formatPercent(
      summary.honoringMatchPercent
    )
  );


  setText(
    "pendingText",
    "في انتظار التقييم: " +
    formatNumber(
      summary.pendingParticipations
    )
  );


  const evaluated =
    Number(
      summary.acceptedParticipations ||
      0
    ) +
    Number(
      summary.rejectedParticipations ||
      0
    );


  const acceptancePercent =
    evaluated > 0
      ? (
          Number(
            summary.acceptedParticipations ||
            0
          ) /
          evaluated
        ) *
        100
      : 0;


  setText(
    "acceptedPercentText",
    formatPercent(
      acceptancePercent
    )
  );


  setText(
    "periodLabel",
    (
      data.filter?.thirdLabel ||
      ""
    ) +
    " — سنة " +
    (
      data.filter?.year ||
      ""
    )
  );


  setText(
    "lastUpdated",
    "آخر تحديث: " +
    formatDateTime(
      data.generatedAt
    )
  );


  renderMonthlyChart(
    data.monthly ||
    []
  );


  renderAcceptance(
    summary
  );


  renderRanking(
    "locationRanking",
    data.topLocations ||
    []
  );


  renderRanking(
    "activityRanking",
    data.topActivities ||
    []
  );


  renderEvaluator(
    data.evaluator ||
    {}
  );

}


function renderMonthlyChart(
  rows
) {

  const container =
    document.getElementById(
      "monthlyChart"
    );


  if (!container) {

    return;

  }


  if (!rows.length) {

    container.innerHTML =
      emptyState(
        "لا توجد بيانات شهرية."
      );

    return;

  }


  const maxValue =
    Math.max(
      1,
      ...rows.map(
        row =>
          Number(
            row.participations ||
            0
          )
      )
    );


  container.innerHTML =
    rows.map(
      function (
        row
      ) {

        const value =
          Number(
            row.participations ||
            0
          );


        const height =
          Math.max(
            value > 0
              ? 5
              : 1,
            (
              value /
              maxValue
            ) *
            100
          );


        return `
          <div class="month-column">

            <div class="bar-track">

              <div
                class="bar-fill"
                style="height:${height}%"
                title="${escapeHtml(row.month)}: ${formatNumber(value)} مشاركة">
              </div>

            </div>

            <strong class="month-total">
              ${formatNumber(value)}
            </strong>

            <span class="month-label">
              ${escapeHtml(row.month)}
            </span>

          </div>
        `;

      }
    )
    .join("");

}


function renderAcceptance(
  summary
) {

  const accepted =
    Number(
      summary.acceptedParticipations ||
      0
    );


  const rejected =
    Number(
      summary.rejectedParticipations ||
      0
    );


  const pending =
    Number(
      summary.pendingParticipations ||
      0
    );


  const total =
    accepted +
    rejected +
    pending;


  const acceptedPct =
    total
      ? (
          accepted /
          total
        ) *
        100
      : 0;


  const rejectedPct =
    total
      ? (
          rejected /
          total
        ) *
        100
      : 0;


  const acceptedEnd =
    acceptedPct;


  const rejectedEnd =
    acceptedPct +
    rejectedPct;


  const donut =
    document.getElementById(
      "acceptanceDonut"
    );


  if (donut) {

    donut.style.background =
      `conic-gradient(
        var(--accepted) 0 ${acceptedEnd}%,
        var(--rejected) ${acceptedEnd}% ${rejectedEnd}%,
        var(--pending) ${rejectedEnd}% 100%
      )`;

  }


  setText(
    "donutPercent",
    formatPercent(
      acceptedPct
    )
  );


  setText(
    "legendAccepted",
    formatNumber(
      accepted
    )
  );


  setText(
    "legendRejected",
    formatNumber(
      rejected
    )
  );


  setText(
    "legendPending",
    formatNumber(
      pending
    )
  );

}


function renderRanking(
  containerId,
  rows
) {

  const container =
    document.getElementById(
      containerId
    );


  if (!container) {

    return;

  }


  if (!rows.length) {

    container.innerHTML =
      emptyState(
        "لا توجد بيانات Ranking لهذا الاختيار."
      );

    return;

  }


  container.innerHTML =
    rows.map(
      function (
        row,
        index
      ) {

        return `
          <div class="ranking-row">

            <span class="rank-number">
              ${index + 1}
            </span>

            <div class="rank-name">

              <strong>
                ${escapeHtml(row.name)}
              </strong>

              <small>
                ${formatNumber(row.participations)} مشاركة
                •
                ${formatNumber(row.contestants)} متسابق
              </small>

            </div>

            <div class="rank-score">

              <strong>
                ${formatNumber(row.points)}
              </strong>

              <small>
                نقطة
              </small>

            </div>

          </div>
        `;

      }
    )
    .join("");

}


function renderEvaluator(
  evaluator
) {

  const average =
    Number(
      evaluator.average ||
      0
    );


  const count =
    Number(
      evaluator.count ||
      0
    );


  setText(
    "evaluatorAverage",
    average.toFixed(
      2
    )
  );


  setText(
    "evaluatorCount",
    formatNumber(
      count
    ) +
    " تقييم"
  );


  const stars =
    document.getElementById(
      "ratingStars"
    );


  if (stars) {

    const rounded =
      Math.max(
        0,
        Math.min(
          5,
          Math.round(
            average
          )
        )
      );


    stars.textContent =
      "★".repeat(
        rounded
      ) +
      "☆".repeat(
        5 -
        rounded
      );

  }


  const container =
    document.getElementById(
      "ratingDistribution"
    );


  if (!container) {

    return;

  }


  const distribution =
    evaluator.distribution ||
    [];


  const max =
    Math.max(
      1,
      ...distribution.map(
        item =>
          Number(
            item.count ||
            0
          )
      )
    );


  container.innerHTML =
    distribution.map(
      function (
        item
      ) {

        const value =
          Number(
            item.count ||
            0
          );


        const width =
          (
            value /
            max
          ) *
          100;


        return `
          <div class="rating-row">

            <span>
              ${item.rating} ⭐
            </span>

            <div class="rating-bar-track">

              <div
                class="rating-bar-fill"
                style="width:${width}%">
              </div>

            </div>

            <strong>
              ${formatNumber(value)}
            </strong>

          </div>
        `;

      }
    )
    .join("");

}


function renderLinkCards(
  containerId,
  rows
) {

  const container =
    document.getElementById(
      containerId
    );


  if (!container) {

    return;

  }


  if (!rows.length) {

    container.innerHTML =
      emptyState(
        "يمكن إضافة روابط جديدة من config.js."
      );

    return;

  }


  container.innerHTML =
    rows.map(
      function (
        item
      ) {

        return `
          <a
            class="link-card"
            href="${escapeAttribute(item.url)}"
            target="_blank"
            rel="noopener noreferrer">

            <span class="link-icon">
              ${escapeHtml(item.icon || "🔗")}
            </span>

            <span class="link-copy">

              <strong>
                ${escapeHtml(item.title || "")}
              </strong>

              <small>
                ${escapeHtml(item.description || "")}
              </small>

            </span>

            <span class="link-arrow">
              ↗
            </span>

          </a>
        `;

      }
    )
    .join("");

}


function setDashboardLoading(
  loading
) {

  const overlay =
    document.getElementById(
      "loadingOverlay"
    );


  const button =
    document.getElementById(
      "refreshDashboardButton"
    );


  if (overlay) {

    overlay.classList.toggle(
      "show",
      Boolean(
        loading
      )
    );

  }


  if (button) {

    button.disabled =
      Boolean(
        loading
      );


    button.textContent =
      loading
        ? "جاري التحديث..."
        : "تحديث Dashboard";

  }

}


function showDashboardError(
  message
) {

  alert(
    message
  );

}


function formatNumber(
  value
) {

  const number =
    Number(
      value ||
      0
    );


  return new Intl.NumberFormat(
    "ar-EG",
    {
      maximumFractionDigits:
        2
    }
  )
  .format(
    number
  );

}


function formatPercent(
  value
) {

  const number =
    Number(
      value ||
      0
    );


  return (
    new Intl.NumberFormat(
      "ar-EG",
      {
        maximumFractionDigits:
          1
      }
    )
    .format(
      number
    ) +
    "%"
  );

}


function formatDateTime(
  value
) {

  const date =
    new Date(
      value
    );


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {

    return "—";

  }


  return new Intl.DateTimeFormat(
    "ar-EG",
    {
      dateStyle:
        "medium",

      timeStyle:
        "short"
    }
  )
  .format(
    date
  );

}


function setText(
  id,
  value
) {

  const element =
    document.getElementById(
      id
    );


  if (element) {

    element.textContent =
      String(
        value
      );

  }

}


function emptyState(
  text
) {

  return (
    '<div class="empty-state">' +
      escapeHtml(
        text
      ) +
    '</div>'
  );

}


function escapeHtml(
  value
) {

  return String(
    value ?? ""
  )
  .replace(
    /&/g,
    "&amp;"
  )
  .replace(
    /</g,
    "&lt;"
  )
  .replace(
    />/g,
    "&gt;"
  )
  .replace(
    /"/g,
    "&quot;"
  )
  .replace(
    /'/g,
    "&#039;"
  );

}


function escapeAttribute(
  value
) {

  return escapeHtml(
    value
  );

}
