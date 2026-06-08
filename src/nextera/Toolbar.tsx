import { availableTools, type Session, type Subject, type ToolAvailability } from './tools';

const TOOL_LABELS: Record<keyof ToolAvailability, string> = {
  zoom: 'Zoom',
  bookmark: 'Bookmark',
  notepad: 'Notepad',
  highlighter: 'Highlighter',
  answerEliminator: 'Answer Eliminator',
  lineReader: 'Line Reader',
  colorChoices: 'Color Choices',
  drawingTool: 'Drawing Tool',
  equationEditor: 'Equation Editor',
  ruler: 'Ruler',
  protractor: 'Protractor',
  referenceSheet: 'Reference Sheet',
  calculator: 'Calculator',
};

export interface ToolbarProps {
  grade: number;
  session: Session;
  subject?: Subject;
}

/** Renders the Nextera-style tool palette, showing only tools enabled for this
 * grade/session/subject (see availableTools). */
export function Toolbar({ grade, session, subject = 'math' }: ToolbarProps) {
  const tools = availableTools(grade, session, subject);
  const keys = Object.keys(TOOL_LABELS) as (keyof ToolAvailability)[];
  return (
    <div role="toolbar" aria-label="Test tools">
      {keys.map((key) => {
        const value = tools[key];
        const enabled = key === 'calculator' ? value !== null : Boolean(value);
        if (!enabled) return null;
        return (
          <button key={key} type="button" data-tool={key}>
            {TOOL_LABELS[key]}
          </button>
        );
      })}
    </div>
  );
}
