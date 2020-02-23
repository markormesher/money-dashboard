import { PostgresNamingStrategy } from "./PostgresNamingStrategy";

describe(__filename, () => {
  const validRegex = /^[a-z0-9_]+$/;
  const ns = new PostgresNamingStrategy();

  describe("columnName()", () => {
    it("should convert column names to postgres-safe formats", () => {
      ns.columnName("column", undefined, []).should.match(validRegex);
      ns.columnName("Column", undefined, []).should.match(validRegex);
      ns.columnName("ColumnName", undefined, []).should.match(validRegex);
    });

    it("should not override custom column names", () => {
      ns.columnName("column", "custom", []).should.equal("custom");
      ns.columnName("column", "Custom", []).should.equal("Custom");
      ns.columnName("column", "CustomName", []).should.equal("CustomName");
    });

    it("should apply prefixes for derived names", () => {
      ns.columnName("column", undefined, ["prefix1"]).should.contain("prefix1");
      ns.columnName("column", undefined, ["prefix1", "prefix2"]).should.contain("prefix1");
      ns.columnName("column", undefined, ["prefix1", "prefix2"]).should.contain("prefix2");
    });

    it("should apply prefixes for custom names", () => {
      ns.columnName("column", "custom", ["prefix1"]).should.contain("prefix1");
      ns.columnName("column", "custom", ["prefix1", "prefix2"]).should.contain("prefix1");
      ns.columnName("column", "custom", ["prefix1", "prefix2"]).should.contain("prefix2");
    });

    it("should convert prefixes for postgres-safe formats", () => {
      ns.columnName("column", undefined, ["prefix"]).should.match(validRegex);
      ns.columnName("column", undefined, ["Prefix"]).should.match(validRegex);
      ns.columnName("column", undefined, ["PrefixName"]).should.match(validRegex);
    });
  });

  describe("joinColumnName()", () => {
    it("should convert join column names to postgres-safe formats", () => {
      ns.joinColumnName("relation", "col").should.match(validRegex);
      ns.joinColumnName("Relation", "Col").should.match(validRegex);
      ns.joinColumnName("RelationName", "ColName").should.match(validRegex);
    });
  });

  describe("joinTableColumnName()", () => {
    it("should convert join table column names to postgres-safe formats", () => {
      ns.joinTableColumnName("relation", "prop", "col").should.match(validRegex);
      ns.joinTableColumnName("Relation", "Prop", "Col").should.match(validRegex);
      ns.joinTableColumnName("RelationName", "PropName", "ColName").should.match(validRegex);
    });
  });

  describe("relationName()", () => {
    it("should convert relation names to postgres-safe formats", () => {
      ns.relationName("relation").should.match(validRegex);
      ns.relationName("Relation").should.match(validRegex);
      ns.relationName("RelationName").should.match(validRegex);
    });
  });

  describe("primaryKeyName()", () => {
    it("should convert primary key names to postgres-safe formats", () => {
      ns.primaryKeyName("table", ["col1", "col2"]).should.match(validRegex);
      ns.primaryKeyName("Table", ["Col1", "Col2"]).should.match(validRegex);
      ns.primaryKeyName("TableName", ["ColName1", "ColName2"]).should.match(validRegex);
    });
  });

  describe("foreignKeyName()", () => {
    it("should convert foreign key names to postgres-safe formats", () => {
      ns.foreignKeyName("table", ["col1", "col2"]).should.match(validRegex);
      ns.foreignKeyName("Table", ["Col1", "Col2"]).should.match(validRegex);
      ns.foreignKeyName("TableName", ["ColName1", "ColName2"]).should.match(validRegex);
    });
  });

  describe("indexName()", () => {
    it("should convert index names to postgres-safe formats", () => {
      ns.indexName("table", ["col1", "col2"]).should.match(validRegex);
      ns.indexName("Table", ["Col1", "Col2"]).should.match(validRegex);
      ns.indexName("TableName", ["ColName1", "ColName2"]).should.match(validRegex);
    });
  });

  describe("uniqueConstraintName()", () => {
    it("should convert unique constraint names to postgres-safe formats", () => {
      ns.uniqueConstraintName("table", ["col1", "col2"]).should.match(validRegex);
      ns.uniqueConstraintName("Table", ["Col1", "Col2"]).should.match(validRegex);
      ns.uniqueConstraintName("TableName", ["ColName1", "ColName2"]).should.match(validRegex);
    });
  });

  describe("relationConstraintName()", () => {
    it("should convert relation constraint names to postgres-safe formats", () => {
      ns.relationConstraintName("table", ["col1", "col2"]).should.match(validRegex);
      ns.relationConstraintName("Table", ["Col1", "Col2"]).should.match(validRegex);
      ns.relationConstraintName("TableName", ["ColName1", "ColName2"]).should.match(validRegex);
    });
  });

  describe("defaultConstraintName()", () => {
    it("should convert default constraint names to postgres-safe formats", () => {
      ns.defaultConstraintName("table", "col").should.match(validRegex);
      ns.defaultConstraintName("Table", "Col").should.match(validRegex);
      ns.defaultConstraintName("TableName", "ColName").should.match(validRegex);
    });
  });

  describe("checkConstraintName()", () => {
    it("should convert check constraint names to postgres-safe formats", () => {
      ns.checkConstraintName("table", "exp").should.match(validRegex);
      ns.checkConstraintName("Table", "Exp").should.match(validRegex);
      ns.checkConstraintName("TableName", "ExpName").should.match(validRegex);
    });
  });

  describe("uniqueConstraintName()", () => {
    it("should convert unique constraint names to postgres-safe formats", () => {
      ns.uniqueConstraintName("table", ["col1", "col2"]).should.match(validRegex);
      ns.uniqueConstraintName("Table", ["Col1", "Col2"]).should.match(validRegex);
      ns.uniqueConstraintName("TableName", ["ColName1", "ColName2"]).should.match(validRegex);
    });
  });
});
