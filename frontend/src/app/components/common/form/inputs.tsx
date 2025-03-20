import React, {
  ChangeEvent,
  InputHTMLAttributes,
  ReactElement,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { concatClasses } from "../../../utils/style.js";
import { FormState } from "./hook.js";
import "./inputs.css";

type FormInputProps<T> = {
  label: string;
  formState: FormState<T>;
  fieldName: Extract<keyof T, string>;
  interactionGeneration?: number;
};

type InputProps<T> = FormInputProps<T> & InputHTMLAttributes<HTMLInputElement>;

function Input<T>(props: InputProps<T>): ReactElement {
  const { label, formState, fieldName, interactionGeneration } = props;
  const [userInteractionGeneration, setUserInteractionGeneration] = React.useState(-1);

  const error = formState.fieldError(fieldName);
  const hasError = !!error;
  const showError = userInteractionGeneration >= (interactionGeneration ?? 0);

  const labelAfterInput = props.type == "checkbox";

  return (
    <label aria-disabled={formState.wg.count > 0}>
      {labelAfterInput ? null : label}
      <input
        name={fieldName}
        disabled={formState.wg.count > 0}
        aria-invalid={hasError && showError ? true : undefined}
        onBlur={() => setUserInteractionGeneration(interactionGeneration ?? 0)}
        autoComplete={"off"}
        {...props}
      />
      {labelAfterInput ? label : null}
      {hasError && showError ? <small>{error}</small> : null}
    </label>
  );
}

type TextareaProps<T> = FormInputProps<T> & TextareaHTMLAttributes<HTMLTextAreaElement>;

function Textarea<T>(props: TextareaProps<T>): ReactElement {
  const { label, formState, fieldName, interactionGeneration } = props;
  const [userInteractionGeneration, setUserInteractionGeneration] = React.useState(-1);

  const error = formState.fieldError(fieldName);
  const hasError = !!error;
  const showError = userInteractionGeneration >= (interactionGeneration ?? 0);

  return (
    <label aria-disabled={formState.wg.count > 0}>
      {label}
      <textarea
        name={fieldName}
        disabled={formState.wg.count > 0}
        aria-invalid={hasError && showError ? true : undefined}
        onBlur={() => setUserInteractionGeneration(interactionGeneration ?? 0)}
        autoComplete={"off"}
        {...props}
      />
      {hasError && showError ? <small>{error}</small> : null}
    </label>
  );
}

type SelectProps<T> = FormInputProps<T> &
  SelectHTMLAttributes<HTMLSelectElement> & {
    nullItemLabel?: string;
  };

function Select<T>(props: React.PropsWithChildren<SelectProps<T>>): ReactElement {
  const { label, formState, fieldName, children, nullItemLabel, interactionGeneration } = props;
  const [userInteractionGeneration, setUserInteractionGeneration] = React.useState(-1);

  const error = formState.fieldError(fieldName);
  const hasError = !!error;
  const showError = userInteractionGeneration >= (interactionGeneration ?? 0);

  return (
    <label aria-disabled={formState.wg.count > 0}>
      {label}
      <select
        name={fieldName}
        disabled={formState.wg.count > 0}
        aria-invalid={hasError && showError ? true : undefined}
        onBlur={() => setUserInteractionGeneration(interactionGeneration ?? 0)}
        autoComplete={"off"}
        {...props}
      >
        <option selected={!props.value}>-- {nullItemLabel ?? "Select"} --</option>
        {children}
      </select>
      {hasError && showError ? <small>{error}</small> : null}
    </label>
  );
}

type SuggestionTextInputProps<T> = FormInputProps<T> & InputHTMLAttributes<HTMLInputElement> & { candidates: string[] };

function SuggestionTextInput<T>(props: SuggestionTextInputProps<T>): ReactElement {
  const maxSuggestions = 10;

  const { label, formState, fieldName, candidates, interactionGeneration } = props;
  const [userInteractionGeneration, setUserInteractionGeneration] = React.useState(-1);

  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = React.useState<string>();
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = React.useState(-1);

  const error = formState.fieldError(fieldName);
  const hasError = !!error;
  const showError = userInteractionGeneration >= (interactionGeneration ?? 0);

  function populateSuggestions(value: string): void {
    if (!value || value === "") {
      clearSuggestions();
      return;
    }

    const scoredCandidates: [string, number][] = [];
    for (const c of candidates) {
      const score = fuzzyScore(c, value);
      if (score >= 0) {
        scoredCandidates.push([c, score]);
      }
    }

    const newSuggestions = scoredCandidates
      .sort((a, b) => b[1] - a[1])
      .slice(0, maxSuggestions)
      .map((s) => s[0]);

    // if the previously-selected suggestion is still in the list, keep it selected
    const newSelectedSuggestionIndex = selectedSuggestion ? newSuggestions.indexOf(selectedSuggestion) : -1;
    const newSelectedSuggestion =
      newSelectedSuggestionIndex >= 0 ? newSuggestions[newSelectedSuggestionIndex] : undefined;

    setSuggestions(newSuggestions);
    setSelectedSuggestion(newSelectedSuggestion);
    setSelectedSuggestionIndex(newSelectedSuggestionIndex);
  }

  function clearSuggestions(): void {
    setSuggestions([]);
    setSelectedSuggestion(undefined);
    setSelectedSuggestionIndex(-1);
  }

  function selectSuggestion(suggestion: string) {
    // this type case is a dirty hack
    const evt = { target: { value: suggestion } } as ChangeEvent<HTMLInputElement>;
    props.onChange?.(evt);
    clearSuggestions();
  }

  function handleKeyDown(evt: React.KeyboardEvent<HTMLInputElement>): void {
    let newIndex: number;
    switch (evt.key) {
      case "ArrowUp":
        newIndex = Math.max(0, selectedSuggestionIndex - 1);
        setSelectedSuggestionIndex(newIndex);
        setSelectedSuggestion(suggestions[newIndex]);
        evt.preventDefault();
        break;

      case "ArrowDown":
        newIndex = Math.min(maxSuggestions - 1, Math.min(suggestions.length - 1, selectedSuggestionIndex + 1));
        setSelectedSuggestionIndex(newIndex);
        setSelectedSuggestion(suggestions[newIndex]);
        evt.preventDefault();
        break;

      case "Enter":
        if (suggestions?.length && selectedSuggestion) {
          selectSuggestion(selectedSuggestion);
          evt.preventDefault();
        }
        break;

      case "Escape":
        if (suggestions?.length) {
          clearSuggestions();
          evt.preventDefault();
          evt.stopPropagation();
        }
        break;
    }
  }

  return (
    <label aria-disabled={formState.wg.count > 0}>
      {label}
      <input
        name={fieldName}
        disabled={formState.wg.count > 0}
        aria-invalid={hasError && showError ? true : undefined}
        type={"text"}
        autoComplete={"off"}
        {...props}
        onChange={(evt) => {
          populateSuggestions(evt.target.value);
          props?.onChange?.(evt);
        }}
        onKeyDown={(evt) => {
          handleKeyDown(evt);
          props?.onKeyDown?.(evt);
        }}
        onBlur={(evt) => {
          // we might be blurring because the user clicked a suggestion;
          // in this case if we clear the suggestions immediately the click will "miss"
          setTimeout(() => clearSuggestions(), 200);
          setUserInteractionGeneration(interactionGeneration ?? 0);
          props?.onBlur?.(evt);
        }}
      />
      {suggestions.length > 0 ? (
        <ul className={"suggestions"}>
          {suggestions.map((suggestion, i) => {
            const letters: ReactElement[] = [];
            let searchIdx = 0;
            for (let suggestionIdx = 0; suggestionIdx < suggestion.length; ++suggestionIdx) {
              if (
                suggestion.charAt(suggestionIdx).toLowerCase() ==
                props?.value?.toString()?.charAt(searchIdx)?.toLowerCase()
              ) {
                ++searchIdx;
                letters.push(<span className={"highlight-letter"}>{suggestion.charAt(suggestionIdx)}</span>);
              } else {
                letters.push(<span>{suggestion.charAt(suggestionIdx)}</span>);
              }
            }

            return (
              <li
                className={concatClasses(i == selectedSuggestionIndex && "active")}
                onClick={() => selectSuggestion(suggestion)}
              >
                {letters}
              </li>
            );
          })}
        </ul>
      ) : null}
      {hasError && showError ? <small>{error}</small> : null}
    </label>
  );
}

function fuzzyScore(candidate: string, search: string): number {
  candidate = candidate.toLowerCase();
  search = search.toLowerCase();
  let c = 0;
  let s = 0;
  let score = 0;

  let lastMatchedPosition = -2;

  while (c < candidate.length && s < search.length) {
    if (candidate.charAt(c) == search.charAt(s)) {
      if (c == 0) {
        // bonus point for being at the beginning of the string
        ++score;
      }

      if (c == lastMatchedPosition + 1) {
        // bonus point each continuous letter
        ++score;
      }

      lastMatchedPosition = c;
      ++c;
      ++s;
    } else {
      ++c;
    }
  }

  if (s < search.length) {
    // we didn't find all the characters in the candidate
    return -1;
  }

  return score;
}

export { Input, Textarea, Select, SuggestionTextInput };
