class DropTableTeams < ActiveRecord::Migration[7.1]
  def change
    drop_table :teams
  end
end
