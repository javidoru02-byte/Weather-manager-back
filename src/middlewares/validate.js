/**
 * Валідує req.body / req.query / req.params за yup-схемою.
 * Провалідовані (та приведені до потрібних типів) дані записуються назад у req.
 *
 * @param {import('yup').Schema} schema
 * @param {'body' | 'query' | 'params'} source
 */
module.exports.validate =
  (schema, source = 'body') =>
  async (req, res, next) => {
    try {
      const validated = await schema.validate(req[source] ?? {}, {
        abortEarly: false,
        stripUnknown: true,
      });

     
      Object.defineProperty(req, source, {
        value: validated,
        writable: true,
        configurable: true,
        enumerable: true,
      });

      next();
    } catch (error) {
      next(error);
    }
  };
