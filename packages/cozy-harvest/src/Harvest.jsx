import React, { PureComponent } from 'react'
import { Field } from 'react-final-form'

export class Harvest extends PureComponent {
  render() {
    return (
      <div>
        <Field name="firstName" component="input" placeholder="First Name" />
        <Field name="interests" component={<input type="password" />} />
        <Field
          name="bio"
          render={({ input, meta }) => (
            <div>
              <label>Bio</label>
              <textarea {...input} />
              {meta.touched && meta.error && <span>{meta.error}</span>}
            </div>
          )}
        />
        <Field name="phone">
          {({ input, meta }) => (
            <div>
              <label>Phone</label>
              <input type="text" {...input} placeholder="Phone" />
              {meta.touched && meta.error && <span>{meta.error}</span>}
            </div>
          )}
        </Field>
      </div>
    )
  }
}

export default Harvest
