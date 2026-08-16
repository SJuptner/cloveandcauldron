export interface TimelineLane {
  id: string;
  label: string;
  order: number;
  label_tr: string;
  label_en: string;
}

export interface TimelineEra {
  name: string;
  start: number;
  end: number;
  lane: string;
  name_tr: string;
  name_en: string;
  row?: number;
}

export interface TimelineEvent {
  date: number;
  title: string;
  lane: string;
  title_tr: string;
  title_en: string;
}

export interface TimelineData {
  lanes: TimelineLane[];
  eras: TimelineEra[];
  events: TimelineEvent[];
}

export interface KnotPath {
  d: string;
  fill: string;
  stroke: string;
  sw: string;
}

export interface KnotData {
  left_paths: KnotPath[];
  right_paths: KnotPath[];
  left_viewbox: string;
  right_viewbox: string;
}
