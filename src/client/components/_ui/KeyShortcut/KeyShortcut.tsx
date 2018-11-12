import { PureComponent, ReactNode } from "react";

interface IKeyShortcutProps {
	readonly keyStr: string;
	readonly onTrigger: () => void;
}

class KeyShortcut extends PureComponent<IKeyShortcutProps> {

	constructor(props: IKeyShortcutProps) {
		super(props);

		this.handleKeyPress = this.handleKeyPress.bind(this);
	}

	public componentDidMount(): void {
		document.addEventListener("keydown", this.handleKeyPress);
	}

	public componentWillUnmount(): void {
		document.removeEventListener("keydown", this.handleKeyPress);
	}

	public render(): ReactNode {
		return this.props.children;
	}

	private handleKeyPress(evt: KeyboardEvent): void {
		if (evt.key === this.props.keyStr) {
			evt.preventDefault();
			this.props.onTrigger();
		}
	}
}

export {
	KeyShortcut,
};
