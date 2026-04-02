export type CivicModalKind =
  | "none"
  | "choose"
  | "submit"
  | "idea"
  | "project";

type StoreSnapshot = {
  modal: CivicModalKind;
  projectId: string | null;
  showTeamJoin: boolean;
};

const initial: StoreSnapshot = {
  modal: "none",
  projectId: null,
  showTeamJoin: false,
};

let snapshot: StoreSnapshot = initial;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function replace(next: StoreSnapshot) {
  snapshot = next;
  emit();
}

export const civicModalStore = {
  subscribe(cb: () => void) {
    listeners.add(cb);
    return () => listeners.delete(cb);
  },
  getSnapshot(): StoreSnapshot {
    return snapshot;
  },
  getServerSnapshot(): StoreSnapshot {
    return initial;
  },
  openChoose() {
    replace({ ...snapshot, modal: "choose", projectId: null, showTeamJoin: false });
  },
  openSubmit() {
    replace({ ...snapshot, modal: "submit", projectId: null, showTeamJoin: false });
  },
  openIdea() {
    replace({ ...snapshot, modal: "idea", projectId: null, showTeamJoin: false });
  },
  openProject(projectId: string) {
    replace({
      ...snapshot,
      modal: "project",
      projectId,
      showTeamJoin: false,
    });
  },
  openProjectWithTeamJoin(projectId: string) {
    replace({
      ...snapshot,
      modal: "project",
      projectId,
      showTeamJoin: true,
    });
  },
  closeModals() {
    replace({ modal: "none", projectId: null, showTeamJoin: false });
  },
};
