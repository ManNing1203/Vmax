import api from "./api";

function formatDateForApi(date) {
  if (!date) return date;

  if (date instanceof Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  return date;
}

function pickGoalEmoji(description, achieved = false) {
  const text = String(description ?? "").toLowerCase();

  if (achieved) return "✅";
  if (text.includes("laptop") || text.includes("computer")) return "💻";
  if (
    text.includes("trip") ||
    text.includes("travel") ||
    text.includes("vacation")
  )
    return "🌴";
  if (
    text.includes("fund") ||
    text.includes("emergency") ||
    text.includes("safety")
  )
    return "🛡️";
  if (text.includes("headphone") || text.includes("audio")) return "🎧";
  if (text.includes("gift") || text.includes("present")) return "🎁";
  if (text.includes("home") || text.includes("house")) return "🏠";
  if (text.includes("car") || text.includes("vehicle")) return "🚗";
  if (
    text.includes("course") ||
    text.includes("study") ||
    text.includes("education")
  )
    return "🎓";
  if (text.includes("phone") || text.includes("mobile")) return "📱";

  return "💰";
}

export function normalizeGoalFromApi(goal, index = 0) {
  const targetAmount = Number(
    goal?.totalTarget ??
      goal?.total_target ??
      goal?.targetAmount ??
      goal?.target_amount ??
      0,
  );
  const currentAmount = Number(
    goal?.totalSaving ??
      goal?.total_saving ??
      goal?.currentAmount ??
      goal?.current_amount ??
      0,
  );
  const achieved = Boolean(
    goal?.achieved ??
    goal?.isAchieved ??
    (targetAmount > 0 && currentAmount >= targetAmount),
  );
  const description = goal?.description ?? goal?.title ?? goal?.name ?? "Goal";

  return {
    id: String(goal?.id ?? goal?.goalId ?? goal?.goal_id ?? index),
    title: description,
    emoji: pickGoalEmoji(description, achieved),
    target_amount: Number.isFinite(targetAmount) ? targetAmount : 0,
    current_amount: Number.isFinite(currentAmount) ? currentAmount : 0,
    target_date: goal?.date ?? goal?.targetDate ?? goal?.target_date ?? null,
    completed_date: goal?.completedDate ?? goal?.completed_date ?? null,
    status: achieved ? "completed" : "active",
    achieved,
  };
}

export async function addGoalRequest({ description, totalTarget, date }) {
  try {
    const response = await api.post("/goal/addGoal", {
      description,
      totalTarget,
      date: formatDateForApi(date),
    });

    if (response.data?.success === false) {
      throw new Error(response.data?.message || "Failed to add goal.");
    }

    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || error?.message || "Failed to add goal.",
    );
  }
}

export async function getGoalsRequest() {
  try {
    const response = await api.get("/goal");

    if (response.data?.success === false) {
      throw new Error(response.data?.message || "Failed to load goals.");
    }

    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "Failed to load goals.",
    );
  }
}
