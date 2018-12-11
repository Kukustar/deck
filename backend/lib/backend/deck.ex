defmodule Backend.Deck do
  use Ecto.Schema
  import Ecto.Changeset


  schema "decks" do
    field :state, :map

    timestamps()
  end

  @doc false
  def changeset(deck, attrs) do
    deck
    |> cast(attrs, [:state])
    |> validate_required([:state])
  end
end
