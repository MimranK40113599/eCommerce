class APIFilters {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
    this.safeQuery = this._sanitizeQuery(queryStr);
  }

  /**
   * Sanitize query parameters to prevent injection
   */
  _sanitizeQuery(queryStr) {
    const sanitized = {};
    const allowedFields = [
      "keyword",
      "page",
      "limit",
      "sort",
      "fields",
      "category",
      "price",
      "ratings",
      "stock",
    ];

    for (const key in queryStr) {
      if (allowedFields.includes(key)) {
        // Validate and sanitize values
        let value = queryStr[key];

        // Remove any potentially harmful characters
        if (typeof value === "string") {
          value = value.replace(/[<>{}()]/g, "");
          // Limit string length
          if (value.length > 100) {
            value = value.substring(0, 100);
          }
        }

        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  /**
   * Search products by keyword
   */
  search() {
    const keyword = this.safeQuery.keyword
      ? {
          $or: [
            {
              name: {
                $regex: this._escapeRegex(this.safeQuery.keyword),
                $options: "i",
              },
            },
            {
              description: {
                $regex: this._escapeRegex(this.safeQuery.keyword),
                $options: "i",
              },
            },
            {
              tags: {
                $regex: this._escapeRegex(this.safeQuery.keyword),
                $options: "i",
              },
            },
          ],
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  /**
   * Escape regex special characters
   */
  _escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  /**
   * Advanced filtering with operators
   */
  filters() {
    const queryCopy = { ...this.safeQuery };

    // Fields to remove (these are handled separately)
    const fieldsToRemove = ["keyword", "page", "limit", "sort", "fields"];
    fieldsToRemove.forEach((el) => delete queryCopy[el]);

    // Advanced filter for price, ratings, stock etc
    let queryStr = JSON.stringify(queryCopy);

    // Only allow safe operators
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|ne|in)\b/g, (match) => {
      const allowedOperators = ["gt", "gte", "lt", "lte", "ne", "in"];
      if (allowedOperators.includes(match)) {
        return `$${match}`;
      }
      return match;
    });

    try {
      const parsedQuery = JSON.parse(queryStr);

      // Validate filter values
      for (const key in parsedQuery) {
        const value = parsedQuery[key];
        if (typeof value === "object" && value !== null) {
          for (const op in value) {
            // Ensure numeric values for numeric fields
            if (["price", "ratings", "stock"].includes(key)) {
              if (isNaN(Number(value[op]))) {
                delete parsedQuery[key];
              }
            }
          }
        }
      }

      this.query = this.query.find(parsedQuery);
    } catch (error) {
      // If JSON parsing fails, use empty query
      this.query = this.query.find({});
    }

    return this;
  }

  /**
   * Sort results
   */
  sort() {
    if (this.safeQuery.sort) {
      const sortBy = this.safeQuery.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      // Default sort by createdAt descending
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  /**
   * Select specific fields
   */
  fields() {
    if (this.safeQuery.fields) {
      const fields = this.safeQuery.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    }
    return this;
  }

  /**
   * Pagination
   */
  pagination() {
    const page = parseInt(this.safeQuery.page) || 1;
    const limit = parseInt(this.safeQuery.limit) || 10;
    const skip = (page - 1) * limit;

    // Validate pagination parameters
    const validPage = Math.max(1, page);
    const validLimit = Math.min(Math.max(1, limit), 100); // Max 100 items per page

    this.query = this.query
      .skip((validPage - 1) * validLimit)
      .limit(validLimit);

    // Store pagination info for response
    this.paginationInfo = {
      page: validPage,
      limit: validLimit,
    };

    return this;
  }

  /**
   * Get pagination metadata
   */
  getPaginationInfo(totalDocuments) {
    const { page, limit } = this.paginationInfo || { page: 1, limit: 10 };
    const totalPages = Math.ceil(totalDocuments / limit);

    return {
      page,
      limit,
      totalDocuments,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };
  }

  /**
   * Apply all filters (chainable)
   */
  applyAll() {
    return this.search().filters().sort().fields().pagination();
  }
}

export default APIFilters;
