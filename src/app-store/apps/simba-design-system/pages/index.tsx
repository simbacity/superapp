import Shell from "../../../shared/components/Shell";
import Select from "react-select";

export default function DesignSystem() {
  return (
    <Shell>
      <div className="layout py-20">
        <h1 className="h1">Simba Design System</h1>
        <section className="my-20">
          <h2 className="h2">.layout</h2>
          <p className="lead-paragraph">Boxed layout wrapper</p>
        </section>
        <section className="my-20">
          <h1 className="h1">.h1 Heading 1</h1>
          <h2 className="h2">.h2 Heading 2</h2>
          <h3 className="h3">.h3 Heading 3</h3>
        </section>
        <section className="my-20">
          <h2 className="h2">.lead-paragraph</h2>
          <p className="lead-paragraph">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec porta
            arcu a magna scelerisque euismod. Morbi in iaculis lectus, nec
            lacinia lacus. Aenean dignissim vehicula dui. Duis accumsan suscipit
            cursus.
          </p>
        </section>
        <section className="my-20">
          <h2 className="h2">.paragraph</h2>
          <p className="paragraph">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec porta
            arcu a magna scelerisque euismod. Morbi in iaculis lectus, nec
            lacinia lacus. Aenean dignissim vehicula dui. Duis accumsan suscipit
            cursus. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Donec porta arcu a magna scelerisque euismod. Morbi in iaculis
            lectus, nec lacinia lacus. Aenean dignissim vehicula dui. Duis
            accumsan suscipit cursus.
          </p>
        </section>
        <section className="my-20">
          <h2 className="h2">.link</h2>
          <p className="paragraph">
            Lorem ipsum dolor <a className="link">sit amet</a>.
          </p>
        </section>
        <section className="my-20">
          <h2 className="h2">.default-button--small</h2>
          <button className="default-button--small">Default Button</button>
          <h2 className="h2">.default-button--medium</h2>
          <button className="default-button--medium">Default Button</button>
          <h2 className="h2">.default-button--large</h2>
          <button className="default-button--large">Default Button</button>
        </section>
        <section className="my-20">
          <h2 className="h2">.default-button--small--disabled</h2>
          <button className="default-button--small--disabled">
            Default Button
          </button>
          <h2 className="h2">.default-button--medium--disabled</h2>
          <button className="default-button--medium--disabled">
            Default Button
          </button>
          <h2 className="h2">.default-button--large--disabled</h2>
          <button className="default-button--large--disabled">
            Default Button
          </button>
        </section>
        <section className="my-20">
          <h2 className="h2">.primary-button--small</h2>
          <button className="primary-button--small">Primary Button</button>
          <h2 className="h2">.primary-button--medium</h2>
          <button className="primary-button--medium">Primary Button</button>
          <h2 className="h2">.primary-button--large</h2>
          <button className="primary-button--large">Primary Button</button>
        </section>
        <section className="my-20">
          <h2 className="h2">.primary-button--small--disabled</h2>
          <button className="primary-button--small--disabled">
            Primary Button
          </button>
          <h2 className="h2">.primary-button--medium--disabled</h2>
          <button className="primary-button--medium--disabled">
            Primary Button
          </button>
          <h2 className="h2">.primary-button--large--disabled</h2>
          <button className="primary-button--large--disabled">
            Primary Button
          </button>
        </section>
        <section className="my-20">
          <h2 className="h2">.danger-button--small</h2>
          <button className="danger-button--small">Danger Button</button>
          <h2 className="h2">.danger-button--medium</h2>
          <button className="danger-button--medium">Danger Button</button>
          <h2 className="h2">.danger-button--large</h2>
          <button className="danger-button--large">Danger Button</button>
        </section>
        <section className="my-20">
          <h2 className="h2">.danger-button--small--disabled</h2>
          <button className="danger-button--small--disabled">
            Danger Button
          </button>
          <h2 className="h2">.danger-button--medium--disabled</h2>
          <button className="danger-button--medium--disabled">
            Danger Button
          </button>
          <h2 className="h2">.danger-button--large--disabled</h2>
          <button className="danger-button--large--disabled">
            Danger Button
          </button>
        </section>
        <section className="my-20">
          <h2 className="h2">.invisible-button--small</h2>
          <button className="invisible-button--small">Invisible Button</button>
          <h2 className="h2">.invisible-button--medium</h2>
          <button className="invisible-button--medium">Invisible Button</button>
          <h2 className="h2">.invisible-button--large</h2>
          <button className="invisible-button--large">Invisible Button</button>
        </section>
        <section className="my-20">
          <h2 className="h2">.invisible-button--small--disabled</h2>
          <button className="invisible-button--small--disabled">
            Invisible Button
          </button>
          <h2 className="h2">.invisible-button--medium--disabled</h2>
          <button className="invisible-button--medium--disabled">
            Invisible Button
          </button>
          <h2 className="h2">.invisible-button--large--disabled</h2>
          <button className="invisible-button--large--disabled">
            Invisible Button
          </button>
        </section>
        <section className="my-20">
          <h2 className="h2">.input</h2>
          <input
            id="first_input"
            name="first_input"
            type="email"
            className="input"
          />
        </section>
        <section className="my-20">
          <h2 className="h2">disabled .input</h2>
          <input
            id="second_input"
            name="second_input"
            type="email"
            disabled
            className="input"
          />
        </section>
        <section className="my-20">
          <h2 className="h2">.label</h2>
          <label htmlFor="label_input" className="label">
            Label (*)
          </label>
          <input
            id="label_input"
            name="label_input"
            type="email"
            className="input"
          />
        </section>
        <section className="my-20">
          <h2 className="h2">.error-text</h2>
          <label htmlFor="label_input" className="label">
            Label (*)
          </label>
          <input id="label_input" name="email" type="email" className="input" />
          <p className="error-text">Please fill out this required field.</p>
        </section>
        <section className="my-20">
          <h2 className="h2">.select</h2>
          <p className="paragraph">
            We are using{" "}
            <a
              href="https://react-select.com/"
              target="_blank"
              rel="noreferrer"
              className="link"
            >
              React Select
            </a>{" "}
            as our select component.
          </p>
          <label htmlFor="options" className="label">
            Choose an option
          </label>
          <Select
            className="select"
            options={[
              { value: "first", label: "First Option" },
              { value: "second", label: "Second Option" },
              { value: "third", label: "Third Option" },
            ]}
          />
        </section>
        <section className="my-20">
          <h2 className="h2">.textarea</h2>
          <label htmlFor="label_input" className="label">
            Type something
          </label>
          <textarea
            rows={4}
            className="textarea"
            placeholder="What's on your mind..."
          ></textarea>
        </section>
      </div>
    </Shell>
  );
}
