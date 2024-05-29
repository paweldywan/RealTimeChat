import {
    Button,
    Form,
    FormGroup,
    Input,
    Label,
    Row,
    RowProps
} from "reactstrap";

import { FormButton, FormInput } from "../interfaces";

interface Props<T> {
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    data: T;
    setData: React.Dispatch<React.SetStateAction<T>>;
    inputs: FormInput<T>[];
    className?: string;
    rowProps?: RowProps[];
    buttonProps?: FormButton;
}

const AppForm = <T,>({
    onSubmit,
    data,
    setData,
    inputs,
    className,
    rowProps,
    buttonProps
}: Props<T>) => {
    return (
        <Form
            onSubmit={onSubmit}
            className={className}
        >
            {[...new Set(inputs.map(i => i.group))].map((group, index) => (
                <Row
                    key={group}
                    {...(rowProps && rowProps[index])}
                >
                    {inputs.filter(i => i.group === group).map(input => (
                        <FormGroup key={input.id.toString()}>
                            {input.label &&
                                <Label for={input.id.toString()}>{input.label}</Label>}

                            <Input
                                type={input.type}
                                value={String(data[input.id])}
                                onChange={input.onChange || (e => setData({ ...data, [input.id]: e.target.value }))}
                                id={input.id.toString()}
                            >
                                {input.options?.map((o, index) => (
                                    <option key={index}>{o}</option>
                                ))}
                            </Input>
                        </FormGroup>
                    ))}
                </Row>
            ))}

            {buttonProps && buttonProps.visible !== false &&
                <Button
                    disabled={buttonProps.disabled}
                >
                    {buttonProps.label}
                </Button>}
        </Form>
    );
};

export default AppForm;