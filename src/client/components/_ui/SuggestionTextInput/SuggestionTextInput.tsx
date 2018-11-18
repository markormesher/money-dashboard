import * as React from "react";
import { KeyboardEvent, MouseEvent, PureComponent, ReactNode } from "react";
import { combine } from "../../../helpers/style-helpers";
import { ControlledTextInput, IControlledTextInputProps } from "../FormComponents/ControlledTextInput";
import * as styles from "./SuggestionTextInput.scss";

interface ISuggestionTextInputProps extends IControlledTextInputProps {
	readonly suggestionOptions?: string[];
}

interface ISuggestionTextInputState {
	readonly cleanUserInput?: string;
	readonly suggestions?: string[];
	readonly selectedSuggestion?: string;
	readonly selectedSuggestionIndex?: number;
}

// TODO: tests
// TODO: sort by relevance (maybe Levenshtein distance?)
// TODO: punctuation (e.g. "N/A") - might be solved by the above

class SuggestionTextInput extends PureComponent<ISuggestionTextInputProps, ISuggestionTextInputState> {

	private static MAX_SUGGESTIONS_SHOWN = 10;

	private static cleanString(str: string): string {
		if (!str) {
			return undefined;
		}

		return str.toLocaleLowerCase().replace(/\W/g, "");
	}

	private static formatSuggestion(suggestion: string, cleanInput: string): ReactNode {
		const output: ReactNode[] = [];
		const suggestionChars = suggestion.split("");
		let consumedInputIndex = 0;
		for (const c of suggestionChars) {
			const cleanC = this.cleanString(c);
			if (cleanC.length && cleanC === cleanInput.charAt(consumedInputIndex)) {
				output.push(<span className={styles.highlight} key={`${consumedInputIndex}-${cleanC}`}>{c}</span>);
				++consumedInputIndex;
			} else {
				output.push(c);
			}
		}
		return <>{output}</>;
	}

	constructor(props: ISuggestionTextInputProps, context: any) {
		super(props, context);
		this.state = {
			cleanUserInput: undefined,
			suggestions: [],
			selectedSuggestion: undefined,
			selectedSuggestionIndex: -1,
		};

		this.renderSuggestions = this.renderSuggestions.bind(this);
		this.handleValueChange = this.handleValueChange.bind(this);
		this.handleBlur = this.handleBlur.bind(this);
		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.handleSuggestionClick = this.handleSuggestionClick.bind(this);
		this.clearSuggestions = this.clearSuggestions.bind(this);
		this.generateSuggestions = this.generateSuggestions.bind(this);
	}

	public render(): ReactNode {
		const { suggestionOptions, ...inputProps } = this.props;
		const innerInputProps = inputProps && inputProps.inputProps || {};
		const { suggestions } = this.state;

		return (
				<>
					<ControlledTextInput
							{...inputProps}
							inputProps={{
								...innerInputProps,
								onBlur: this.handleBlur,
								onKeyDown: this.handleKeyDown,
							}}
							onValueChange={this.handleValueChange}
					/>
					{suggestions && suggestions.length > 0 && this.renderSuggestions()}
				</>
		);
	}

	private renderSuggestions(): ReactNode {
		const { cleanUserInput, suggestions, selectedSuggestionIndex } = this.state;
		const hasOverflow = suggestions.length > SuggestionTextInput.MAX_SUGGESTIONS_SHOWN;
		return (
				<div className={styles.suggestionWrapper}>
					<ul>
						{suggestions.slice(0, SuggestionTextInput.MAX_SUGGESTIONS_SHOWN).map((s, i) => (
								<li
										key={s}
										title={s}
										className={combine(selectedSuggestionIndex === i && styles.active)}
										onMouseDown={this.handleSuggestionClick}
								>
									{SuggestionTextInput.formatSuggestion(s, cleanUserInput)}
								</li>
						))}
						{hasOverflow && <li key={"..."} className={styles.overflow}>...</li>}
					</ul>
				</div>
		);
	}

	private handleValueChange(value: string, id: string): void {
		this.generateSuggestions(value);

		if (this.props.onValueChange) {
			this.props.onValueChange(value, id);
		}
	}

	private handleKeyDown(evt: KeyboardEvent<HTMLInputElement>): void {
		const UP_KEY = 38;
		const DOWN_KEY = 40;
		const ENTER_KEY = 13;
		const ESC_KEY = 27;

		const { id } = this.props;
		const { suggestions, selectedSuggestion } = this.state;
		let { selectedSuggestionIndex } = this.state;

		switch (evt.keyCode) {
			case UP_KEY:
				selectedSuggestionIndex = Math.max(0, selectedSuggestionIndex - 1);
				this.setState({
					selectedSuggestionIndex,
					selectedSuggestion: suggestions[selectedSuggestionIndex],
				});
				evt.preventDefault();
				break;

			case DOWN_KEY:
				selectedSuggestionIndex = Math.min(
						SuggestionTextInput.MAX_SUGGESTIONS_SHOWN - 1,
						Math.min(suggestions.length - 1, selectedSuggestionIndex + 1),
				);
				this.setState({
					selectedSuggestionIndex,
					selectedSuggestion: suggestions[selectedSuggestionIndex],
				});
				evt.preventDefault();
				break;

			case ENTER_KEY:
				if (suggestions && suggestions.length) {
					if (this.props.onValueChange) {
						this.props.onValueChange(selectedSuggestion, id);
					}
					this.clearSuggestions();
					evt.preventDefault();
				}
				break;

			case ESC_KEY:
				if (suggestions && suggestions.length) {
					this.clearSuggestions();
					evt.preventDefault();
				}
				break;
		}
	}

	private handleSuggestionClick(evt: MouseEvent<HTMLLIElement>): void {
		const { id } = this.props;
		const value = (evt.target as HTMLLIElement).title;
		if (this.props.onValueChange) {
			this.props.onValueChange(value, id);
		}
		this.clearSuggestions();
	}

	private handleBlur(): void {
		this.clearSuggestions();
	}

	private clearSuggestions(): void {
		this.setState({
			suggestions: undefined,
			selectedSuggestionIndex: -1,
			selectedSuggestion: undefined,
		});
	}

	private generateSuggestions(value: string): void {
		const cleanValue = SuggestionTextInput.cleanString(value);

		if (!cleanValue || cleanValue === "") {
			this.clearSuggestions();
			return;
		}

		const { suggestionOptions } = this.props;
		const { selectedSuggestion } = this.state;

		const regex = new RegExp(".*" + cleanValue.split("").join(".*") + ".*");
		const suggestions = suggestionOptions.filter((s) => regex.test(SuggestionTextInput.cleanString(s)));

		// if the previously-selected suggestion is still in the list, keep it selected
		const newSelectedSuggestionIndex = suggestions.indexOf(selectedSuggestion);
		const newSelectedSuggestion = newSelectedSuggestionIndex >= 0 ? suggestions[newSelectedSuggestionIndex] : undefined;

		this.setState({
			cleanUserInput: cleanValue,
			suggestions,
			selectedSuggestion: newSelectedSuggestion,
			selectedSuggestionIndex: newSelectedSuggestionIndex,
		});
	}
}

export {
	SuggestionTextInput,
};
