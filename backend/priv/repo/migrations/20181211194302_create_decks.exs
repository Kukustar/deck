defmodule Backend.Repo.Migrations.CreateDecks do
  use Ecto.Migration

  def change do
    create table(:decks) do
      add :state, :map

      timestamps()
    end

  end
end
