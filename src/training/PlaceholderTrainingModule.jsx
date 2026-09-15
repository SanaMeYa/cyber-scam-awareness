export default function PlaceholderTrainingModule({ title }) {
  return (
    <section className="training-placeholder" aria-label={`${title} module in development`}>
      <span aria-hidden="true">◇</span>
      <h3>{title}</h3>
      <p>This awareness module is reserved for the next development stage.</p>
    </section>
  )
}
